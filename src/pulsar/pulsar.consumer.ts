import { Logger, OnModuleInit } from "@nestjs/common";
import { nextTick } from "process";
import { Client, Consumer, ConsumerConfig, Message } from "pulsar-client";

export abstract class PulsarConsumer<T> implements OnModuleInit {
    private consumer: Consumer;
    protected readonly logger = new Logger(this.config.topic);
    protected isConsuming = true;

    constructor(
        private readonly pulsarClient: Client,
        private readonly config: ConsumerConfig,
    ) { }

    protected async subscribe() {
        try {
            this.consumer = await this.pulsarClient.subscribe(this.config);
            nextTick(this.listenForMessages.bind(this));
        } catch (err) {
            this.logger.error("Failed to subscribe", err);
        }
    }

    private async listenForMessages() {
        while (this.isConsuming) {
            let message: Message;

            try {
                message = await this.consumer.receive();
                const data: T = JSON.parse(message.getData().toString());
                await this.handleMessage(data, message.getMessageId().toString());
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

    protected abstract handleMessage(data: T, messageId: string): Promise<void> | void;

    async onModuleInit() {
        await this.subscribe();
    }
}