import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { AlertState, AlertStateSchema } from './schemas/alert-state.schema';
import { AuthModule } from '../auth/auth.module';
import { WeatherModule } from '../weather/weather.module';
import { AlertsQueue } from './jobs/alerts.queue';
import { AlertsWorkers } from './jobs/alerts.worker';
import { StatesController } from './alertStates/states.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: AlertState.name, schema: AlertStateSchema },
    ]),
    AuthModule,
    WeatherModule,
  ],
  controllers: [AlertsController, StatesController],
  providers: [AlertsService, AlertsQueue, AlertsWorkers],
  exports: [AlertsService],
})
export class AlertsModule implements OnModuleInit {
  constructor(private readonly queue: AlertsQueue) {}
  async onModuleInit() {
    await this.queue.scheduleScanner();
  }
}
