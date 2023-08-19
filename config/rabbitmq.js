import rabbitmq from "amqplib";

let channel, connection; //global variables
async function connectQueue() {
    try {
        connection = await rabbitmq.connect(
            process.env.RABBITMQ_URL || "amqp://rabbitmq:5672"
        );
        channel = await connection.createChannel();

        await channel.assertQueue("test-queue");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { connectQueue, channel, connection };
