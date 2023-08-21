import rabbitmq from "amqplib";

let channel, connection; //global variables
async function connectQueue(callback) {
  try {
    connection = await rabbitmq.connect(
      process.env.RABBITMQ_URL || "amqp://rabbitmq:5672"
    );

    connection.on("error", (err) => {
      console.log("ERROR", err);
      if (err?.message !== "Connection closing") {
        console.error("Raabitmq conn error", err?.message);
      }
    });
    connection.on("close", function () {
      console.log("connection closed");
      console.error("[AMQP] reconnecting");
      return setTimeout(() => {
        connectQueue(callback);
      }, 1000);
    });
    // channel = await connection.createChannel();
    // await channel.assertQueue("test-queue");
    callback();
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { connectQueue, channel, connection };
