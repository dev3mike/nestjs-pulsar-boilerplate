import { Injectable } from '@nestjs/common';
import { topicName } from 'src/app.constants';
import { PulsarProducerService } from 'src/pulsar/pulsar-producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: PulsarProducerService) {
  }

  async produceMessage(request: any) {

    for (let i = 0; i <= 1000; i++)
      this.producerService.produce(topicName, request);

  }
}
