import { Inject, Injectable } from "@nestjs/common";
import { Client, Producer } from "pulsar-client";
import { PULSAR_CLIENT } from "src/pulsar/pulsar.constants";

@Injectable()
export class PulsarProducerService {
    private readonly producers = new Map<string, Producer>();

    constructor(@Inject(PULSAR_CLIENT) private readonly pulsarClient: Client) { }

    async produce(topic: Lowercase<string>, message: object) {
        const producer = await this.getProducerByTopic(topic);
        await producer.send({
            data: Buffer.from(JSON.stringify(message))
        });
    }

    private async getProducerByTopic(topic: string) {
        let producer = this.producers.get(topic);
        if (!producer) {
            producer = await this.pulsarClient.createProducer({ topic });
            this.producers.set(topic, producer);
        }
        return producer;
    }
}