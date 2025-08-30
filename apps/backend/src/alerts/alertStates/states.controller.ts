import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { User, ReqUser } from '../../auth/user.decorator';
import { AlertsService } from '../alerts.service';

@UseGuards(JwtGuard)
@Controller()
export class StatesController {
  constructor(private readonly alerts: AlertsService) {}

  @Post('alerts/:id/evaluate')
  evaluate(@Param('id') id: string, @User() user: ReqUser) {
    return this.alerts.evaluateOne(id, user.userId);
  }

  @Get('states/current')
  current(@User() user: ReqUser) {
    return this.alerts.listCurrentTriggered(user.userId);
  }
}
