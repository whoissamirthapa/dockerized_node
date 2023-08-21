export const consumeQueue = async (channel, queueName) => {
    if (channel) {
        await channel.assertQueue(queueName, { durable: true });

        let msg = [];
        channel.consume(queueName, async (message) => {
            const data = JSON.parse(message.content.toString());
            // Send success response to the reply-to queue
            const successMessage = "Data saved successfully";
            if (data?.replyToQueue)
                channel.sendToQueue(replyToQueue, Buffer.from(successMessage));

            channel.ack(message);
            const temp = [];
            temp.push(data);
            msg = temp;
        });
        if (msg.length > 0) return msg;
    }
};
