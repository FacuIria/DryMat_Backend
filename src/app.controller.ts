import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return { ok: true, name: 'DryMat API' };
  }

  @Get('health')
  health() {
    return { ok: true };
  }
}
