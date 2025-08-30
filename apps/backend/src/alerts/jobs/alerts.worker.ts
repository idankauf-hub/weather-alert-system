import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Worker, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AlertsService } from '../alerts.service';
import { Alert } from '../schemas/alert.schema';
import { ALERTS_QUEUE, JOB_EVAL, JOB_SCAN, AlertsQueue } from './alerts.queue';
import { AlertDocument } from '../types';

@Injectable()
export class AlertsWorkers implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AlertsWorkers.name);
  private conn: IORedis;
  private worker: Worker | null = null;

  constructor(
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    private readonly alerts: AlertsService,
    private readonly alertsQueue: AlertsQueue,
  ) {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.conn = new IORedis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  async onModuleInit() {
    this.worker = new Worker(
      ALERTS_QUEUE,
      async (job) => {
        if (job.name === JOB_SCAN) {
          this.logger.log('Scanning alerts...');
          const batch = 200;
          let skip = 0;
          while (true) {
            const docs = await this.alertModel
              .find({}, { _id: 1, userId: 1 })
              .sort({ _id: 1 })
              .skip(skip)
              .limit(batch)
              .lean();
            if (!docs.length) break;
            skip += docs.length;

            const jobs = docs.map((d) => ({
              name: JOB_EVAL,
              data: {
                alertId: d._id.toString(),
                userId: (d.userId as Types.ObjectId).toString(),
              },
              opts: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5_000 },
                removeOnComplete: 100,
                removeOnFail: 200,
              } as JobsOptions,
            }));

            if ((this.alertsQueue.queue as any).addBulk) {
              await (this.alertsQueue.queue as any).addBulk(jobs);
            } else {
              await Promise.all(
                jobs.map((j) =>
                  this.alertsQueue.queue.add(
                    j.name as any,
                    j.data as any,
                    j.opts,
                  ),
                ),
              );
            }
          }
          this.logger.log('Scan done.');
          return;
        }

        if (job.name === JOB_EVAL) {
          const { alertId, userId } = job.data as {
            alertId: string;
            userId: string;
          };
          await this.alerts.evaluateOne(alertId, userId);
          return;
        }
      },
      { connection: this.conn, concurrency: 10 },
    );

    this.worker.on('failed', (j, err) =>
      this.logger.warn(`Job ${j?.name} failed ${j?.id}: ${err?.message}`),
    );
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.conn.quit();
  }
}
