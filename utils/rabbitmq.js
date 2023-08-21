export const consumeQueue = async (channel, queueName) => {
    if (channel) {
        await channel.assertQueue(queueName, { durable: true });

        let msg = [];
        channel.prefetch(1);
        channel.consume(queueName, async (message) => {
            const data = JSON.parse(message.content.toString());
            // Send success response to the reply-to queue
            const successMessage = "Data saved successfully";
            if (data?.replyToQueue)
                channel.sendToQueue(replyToQueue, Buffer.from(successMessage));

            msg.push(data);
            channel.ack(message);
        });
        if (msg.length > 0) return msg;
    }
};
