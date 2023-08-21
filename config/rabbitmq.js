import rabbitmq from "amqplib/callback_api.js";

let channel, connection; //global variables
async function connectQueue(callback) {
    try {
        rabbitmq.connect(
            process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",
            (err, conn) => {
                if (err) {
                    console.log("RabbitMQ", err.message);
                    return setTimeout(this, 1000);
                }
                conn.on("error", (err) => {
                    console.log("ERROR", err);
                    if (err?.message !== "Connection closing") {
                        console.error("Raabitmq conn error", err?.message);
                    }
                });
                conn.on("close", function () {
                    console.log("connection closed");
                    console.log("RabbitMQ reconnecting");
                    return setTimeout(() => {
                        connectQueue(callback);
                    }, 1000);
                });
                connection = conn;
                // channel = await connection.createChannel();
                // await channel.assertQueue("test-queue");
                callback();
            }
        );
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { connectQueue, channel, connection };
