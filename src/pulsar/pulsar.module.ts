import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pulsar-client';
import { PulsarProducerService } from 'src/pulsar/pulsar-producer.service';
import { PulsarClientService } from 'src/pulsar/pulsar-client.service';
import { PULSAR_CLIENT } from 'src/pulsar/pulsar.constants';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: PULSAR_CLIENT,
            useFactory: (configService: ConfigService) => new Client({
                serviceUrl: configService.getOrThrow('PULSAR_SERVICE_URL')
            }),
            inject: [ConfigService]
        },
        PulsarProducerService,
        PulsarClientService
    ],
    exports: [PulsarProducerService, PULSAR_CLIENT]
})
export class PulsarModule {

}
