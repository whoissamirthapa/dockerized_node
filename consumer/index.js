import { RabbitClass } from "../rabbitmq/pubSub.js";
import { Getvalue } from "./getValue.js";
import { GetImage } from "./imageProcessing.js";

const consumer = async () => {
    console.log("consumer");
    const queue = ["test-queue", "test-queue1", "test-queue2"];
    for (let index = 0; index < queue.length; index++) {
        const element = queue[index];
        RabbitClass.StartConsumer(
            "exchange-test",
            element,
            element,
            (msg, abc) => {
                console.log(
                    "msg recieved in " + element,
                    msg.content.toString()
                );
                if (element === "test-queue") {
                    Getvalue(msg.content.toString());
                }
                if (element === "test-queue1") {
                    GetImage(msg.content.toString());
                }
                abc(true);
            }
        );
    }
};

export default consumer;
