import { channel } from "../config/rabbitmq";
import connection from "../config/rabbitmq.js";

export class RabbitClass {
  static pubChannel;
  static StartConsumer = (queue, fnConsumer) => {
    connection.createChannel(function (err, ch) {
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
      ch.assertQueue(queue, { durable: true }, function (err, _ok) {
        if (closeOnErr(err)) return;
        // Consume incoming messages
        ch.consume(queue, processMsg, { noAck: false });
        console.log("rabbitmq Worker is started");
      });
      function processMsg(msg) {
        // Process incoming messages and send them to fnConsumer
        // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
        fnConsumer(msg, function (ok) {
          try {
            ok ? ch.ack(msg) : ch.reject(msg, true);
          } catch (e) {
            closeOnErr(e);
          }
        });
      }
    });
  };
  static StartPublisher = () => {
    // Init publisher
    connection.createConfirmChannel(function (err, ch) {
      if (closeOnErr(err)) return;

      ch.on("error", function (err) {
        console.error("rabbitmq channel error", err.message);
      });

      ch.on("close", function () {
        console.log("rabbitmq channel closed");
      });

      // Set publisher channel in a var
      pubChannel = ch;
      console.log("rabbitmq Publisher started");
    });
  };
  static PublishMessage = (exchange, routingKey, content, options = {}) => {
    // Verify if pubchannel is started
    if (!pubChannel) {
      console.error(
        "rabbitmq Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function"
      );
      return;
    }
    // convert string message in buffer
    const message = Buffer.from(content, "utf-8");
    try {
      // Publish message to exchange
      // options is not required
      pubChannel.publish(exchange, routingKey, message, options, (err) => {
        if (err) {
          console.error("rabbitmq publish", err);
          pubChannel.connection.close();
          return;
        }
        console.log("rabbitmq message delivered");
      });
    } catch (e) {
      console.error("rabbitmq publish", e.message);
    }
  };
}
