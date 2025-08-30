import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertsService } from './alerts.service';
import { JwtGuard } from '../auth/jwt.guard';
import { User, ReqUser } from '../auth/user.decorator';

@UseGuards(JwtGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alerts: AlertsService) {}

  @Post()
  create(@Body() dto: CreateAlertDto, @User() user: ReqUser) {
    return this.alerts.create(dto, user.userId);
  }

  @Get()
  list(@User() user: ReqUser) {
    return this.alerts.findAll(user.userId);
  }

  @Get(':id')
  get(@Param('id') id: string, @User() user: ReqUser) {
    return this.alerts.findOne(id, user.userId);
  }

  @Delete(':id')
  del(@Param('id') id: string, @User() user: ReqUser) {
    return this.alerts.remove(id, user.userId);
  }
}
