import { RabbitClass } from "../rabbitmq/pubSub.js";

const publisher = () => {
    // console.log("Rabbitmq connected");
    const queue = ["test-queue", "test-queue1", "test-queue2"];
    for (let index = 0; index < queue.length; index++) {
        const element = queue[index];
        RabbitClass.StartPublisher("exchange-test", "topic", element);
    }
};

export default publisher;
