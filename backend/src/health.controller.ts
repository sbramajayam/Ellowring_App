import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @Version(['1', VERSION_NEUTRAL])
  ok() {
    return { status: 'ok', service: 'ellowring-api', version: 'v1' };
  }
}
