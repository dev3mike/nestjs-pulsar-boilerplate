import { Inject, Injectable } from "@nestjs/common";
import { Client } from "pulsar-client";
import { topicName } from "src/app.constants";
import { PULSAR_CLIENT } from "src/pulsar/pulsar.constants";
import { PulsarConsumer } from "src/pulsar/pulsar.consumer";

@Injectable()
export class AppConsumer extends PulsarConsumer<any> {
    constructor(
        @Inject(PULSAR_CLIENT) pulsarClient: Client
    ) {
        super(
            pulsarClient,
            {
                topic: topicName,
                subscriptionType: 'Shared',
                subscription: 'shared',
            });
    }

    protected handleMessage(data: any, messageId: string): void {
        this.logger.log("Handling the message", messageId, data);
    }
}