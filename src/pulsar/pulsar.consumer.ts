import { Logger } from "@nestjs/common";
import { nextTick } from "process";
import { Client, Consumer, ConsumerConfig, Message } from "pulsar-client";

export abstract class PulsarConsumer<T> {
    private consumer: Consumer;
    private readonly logger = new Logger(this.config.topic);
    protected isConsuming = true;

    constructor(
        private readonly pulsarClient: Client,
        private readonly config: ConsumerConfig,
        private readonly onMessageHandler: (messageData: T) => void
    ) { }

    protected async subscribe() {
        this.consumer = await this.pulsarClient.subscribe(this.config);
        nextTick(this.listenForMessages.bind(this));
    }

    private async listenForMessages() {
        while (this.isConsuming) {
            let message: Message;

            try {
                message = await this.consumer.receive();
                const data: T = JSON.parse(message.getData().toString());
                this.onMessageHandler(data);
                console.log(data);
            } catch (err) {
                this.logger.error("Failed to consume the message", err);
            }

            try {
                if (message)
                    this.consumer.acknowledge(message);
            } catch (err) {
                this.logger.error("Failed to acknowledge the message", err);
            }
        }
    }
}