import { channel } from "../config/rabbitmq.js";
import { consumeQueue } from "../utils/rabbitmq.js";

async function sendData(data) {
    // send data to queue
    console.log("data into queue", data);
    try {
        await channel.sendToQueue(
            "test-queue",
            Buffer.from(JSON.stringify(data))
        );
        const replyToQueue = `reply-to-${generateUniqueID()}`;
        await channel.assertQueue(replyToQueue);

        const message = JSON.stringify({ data: userData, replyToQueue });
        channel.sendToQueue("dataQueue", Buffer.from(message));

        const successMessage = await new Promise((resolve) => {
            channel.consume(replyToQueue, (message) => {
                const content = message.content.toString();
                resolve(content);
                channel.ack(message);
            });
        });

        return { success: true, msg: successMessage, data };
    } catch (error) {
        console.log("error in sending into queue", error);
        return { success: false };
    } finally {
    }
}

async function recieveData() {
    // receive data from queue
    try {
        if (!channel) return false;
        const data = await consumeQueue(channel, "test-queue");
        console.log("data from queue", data);
        return { success: true, data };
    } catch (error) {
        console.log("error in receiving from queue", error);
        return { success: false };
    } finally {
    }
}
export { sendData, recieveData };
