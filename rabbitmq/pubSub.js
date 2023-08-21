import { channel } from "../config/rabbitmq.js";
import { connection } from "../config/rabbitmq.js";

export class RabbitClass {
    static pubChannel;
    static StartConsumer(queue, fnConsumer) {
        if (!connection)
            return console.log("rabbitmq connection is not initialized");
        connection.createChannel(async function (err, ch) {
            if (closeOnErr(err)) return;

            ch.on("error", function (err) {
                console.error("rabbitmq channel error", err.message);
            });

            ch.on("close", function () {
                console.log("rabbitmq channel closed");
            });
            // Set prefetch value
            ch.prefetch(1);
            // Connect to queue
            // If we use direct exchange, we need to declare queue and bind queue with exchange
            await ch.assertExchange("test-exchange", "direct", {
                durable: true,
            });
            await ch.bindQueue(queue, "test-exchange", "");
            // when we use fanout exchange, we don't need to declare queue
            //When we use fanout exchange, we don't need to bind queue with exchange
            // await ch.assertExchange("test-exchange1", "fanout", {
            //     durable: true,
            // });
            // await ch.bindQueue(queue, "test-exchange1", "");
            ch.assertQueue(queue, { durable: true }, function (err, _ok) {
                if (closeOnErr(err)) return;
                // Consume incoming messages
                ch.consume(
                    queue,
                    function (msg) {
                        // console.log("msg", msg.content.toString());
                        // Process incoming messages and send them to fnConsumer
                        // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
                        if (msg === null) return;
                        fnConsumer(msg, function (ok) {
                            try {
                                ok ? ch.ack(msg) : ch.reject(msg, true);
                            } catch (e) {
                                closeOnErr(e);
                            }
                        });
                    },
                    { noAck: false }
                );
                console.log("rabbitmq Worker is started");
            });
        });
    }
    static StartPublisher(exchangeName, exchangeType, queueName) {
        // Init publisher channel
        connection.createConfirmChannel((err, ch) => {
            if (closeOnErr(err)) return;

            ch.on("error", function (err) {
                console.log("rabbitmq channel error", err.message);
            });

            ch.on("close", function () {
                console.log("rabbitmq channel closed");
            });
            ch.assertQueue(queueName, { durable: true }, (err, _ok) => {
                if (err) {
                    console.error("Error declaring queue:", err);
                    return;
                }
                console.log("Queue declared successfully");
            });
            ch.assertExchange(
                exchangeName,
                exchangeType,
                { durable: true },
                (err, _ok) => {
                    if (err) {
                        console.error(
                            "rabbitmq exchange declaration error",
                            err
                        );
                        ch.connection.close();
                        return;
                    }

                    // Set publisher channel in a var
                    this.pubChannel = ch;
                    console.log("rabbitmq Publisher started");
                }
            );
        });
    }
    static PublishMessage(exchange, routingKey, content, options = {}) {
        // Verify if pubchannel is started
        if (!this.pubChannel) {
            console.log(
                "rabbitmq Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function"
            );
            return;
        }
        // convert string message in buffer
        const message = Buffer.from(content, "utf-8");
        try {
            // Publish message to exchange
            // options is not required
            this.pubChannel.publish(
                exchange,
                routingKey,
                message,
                options,
                (err) => {
                    if (err) {
                        console.error("rabbitmq publish", err);
                        this.pubChannel.connection.close();
                        return;
                    }
                    console.log("rabbitmq message delivered");
                }
            );
        } catch (e) {
            console.error("rabbitmq publish", e.message);
        }
    }
}

function closeOnErr(err) {
    if (!err) return false;
    console.log("rabbitmq error", err);
    connection.close();
    return true;
}

export function callback(msg, abc) {
    console.log("msg", msg.content.toString());
    abc(true);
}
