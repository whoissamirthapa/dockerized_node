import express from "express";
import { connectQueue } from "./config/rabbitmq.js";
import { sendData } from "./rabbitmq/index.js";
import { RabbitClass } from "./rabbitmq/pubSub.js";
import publisher from "./publisher/index.js";
import consumer from "./consumer/index.js";

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
    RabbitClass.PublishMessage(
        "exchange-test",
        "test-queue",
        data?.message,
        {}
    );
    res.json({ success: true, msg: "data sent to queue" });
    // RabbitClass.PublishMessage("exchange-test", "", data?.message, {});
});
app.post("/api/send-data-to-queue1", async (req, res) => {
    const data = req.body;
    if (!data) return res.status(400).json({ success: false, msg: "No data" });
    // send data to queue
    // const resFinal = await sendData(data);

    // if (resFinal?.success) {
    //     return res.status(200).json({ success: true, data: resFinal });
    // }
    RabbitClass.PublishMessage(
        "exchange-test",
        "test-queue1",
        data?.message,
        {}
    );
    res.json({ success: true, msg: "data sent to queue" });
    // RabbitClass.PublishMessage("exchange-test", "", data?.message, {});
});
app.post("/api/send-data-to-queue2", async (req, res) => {
    const data = req.body;
    if (!data) return res.status(400).json({ success: false, msg: "No data" });
    // send data to queue
    // const resFinal = await sendData(data);

    // if (resFinal?.success) {
    //     return res.status(200).json({ success: true, data: resFinal });
    // }
    RabbitClass.PublishMessage(
        "exchange-test",
        "test-queue2",
        data?.message,
        {}
    );
    res.json({ success: true, msg: "data sent to queue" });
    // RabbitClass.PublishMessage("exchange-test", "", data?.message, {});
});

app.get("/api/v1", (req, res) => {
    res.status(200).json({ msg: "hello there from api" });
});

app.listen(5000, () => {
    console.log("App is running at port" + 5000);
    connectQueue(function () {
        consumer();
        // RabbitClass.StartConsumer("test-queue", (msg, abc) => {
        //     console.log("msg", msg.content.toString());
        //     abc(true);
        // });
        publisher();
        // RabbitClass.StartPublisher("test-exchange", "direct", "test-queue");
        // RabbitClass.StartPublisher("exchange-test", "direct", "test-queue1");
        console.log("Rabbitmq connected");
    });
});
