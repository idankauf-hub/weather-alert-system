import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

export const ALERTS_QUEUE = 'alerts';
export const JOB_SCAN = 'scan-alerts';
export const JOB_EVAL = 'evaluate-alert';

@Injectable()
export class AlertsQueue implements OnModuleDestroy {
  public readonly conn: IORedis;
  public readonly queue: Queue;

  constructor() {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.conn = new IORedis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    this.queue = new Queue(ALERTS_QUEUE, { connection: this.conn });
  }

  async addEval(alertId: string, userId: string, opts: JobsOptions = {}) {
    return this.queue.add(
      JOB_EVAL,
      { alertId, userId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: 50,
        removeOnFail: 100,
        ...opts,
      },
    );
  }
  async scheduleScanner() {
    const id = 'alerts-scan';
    await this.queue.removeJobScheduler(id).catch(() => {});

    const cron = process.env.ALERT_SCAN_CRON;
    const everyMs = process.env.ALERT_SCAN_EVERY_MS
      ? Number(process.env.ALERT_SCAN_EVERY_MS)
      : undefined;

    if (cron) {
      await this.queue.upsertJobScheduler(
        id,
        { pattern: cron, tz: 'UTC' },
        { name: JOB_SCAN, data: {} },
      );
    } else if (everyMs && everyMs > 0) {
      await this.queue.upsertJobScheduler(
        id,
        { every: everyMs },
        { name: JOB_SCAN, data: {} },
      );
    } else {
      await this.queue.upsertJobScheduler(
        id,
        { every: 5 * 60_000 },
        { name: JOB_SCAN, data: {} },
      );
    }
  }

  async onModuleDestroy() {
    await this.queue.close();
    await this.conn.quit();
  }
}
