import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  @Get()
  metrics() {
    return `# HELP kafka_ui_health 1\n# TYPE kafka_ui_health gauge\nkafka_ui_health 1`;
  }
}
