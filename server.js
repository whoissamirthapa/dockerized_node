import express from "express";
import { connectQueue } from "./config/rabbitmq.js";
import { sendData } from "./rabbitmq/index.js";
import { RabbitClass } from "./rabbitmq/pubSub.js";

const app = express();
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    res.send("hello there");
});

app.post("/api/send-data-to-queue", async (req, res) => {
    const data = req.body;
    if (!data) return res.status(400).json({ success: false, msg: "No data" });
    // send data to queue
    // const resFinal = await sendData(data);

    // if (resFinal?.success) {
    //     return res.status(200).json({ success: true, data: resFinal });
    // }
    RabbitClass.PublishMessage("test-exchange", "", data?.message, {});
    res.json({ success: true, msg: "data sent to queue" });
    // RabbitClass.PublishMessage("test-exchange1", "", data?.message, {});
});

app.get("/api/v1", (req, res) => {
    res.status(200).json({ msg: "hello there from api" });
});

app.listen(5000, () => {
    console.log("App is running at port" + 5000);
    connectQueue(function () {
        RabbitClass.StartConsumer("test-queue", (msg, abc) => {
            console.log("msg", msg.content.toString());
            abc(true);
        });
        RabbitClass.StartPublisher("test-exchange", "direct", "test-queue");
        // RabbitClass.StartPublisher("test-exchange1", "direct", "test-queue1");
        console.log("Rabbitmq connected");
    });
});
