import express from "express";
import { connectQueue } from "./config/rabbitmq.js";
import { sendData } from "./rabbitmq/index.js";
import { RabbitClass } from "./rabbitmq/pubSub.js";
import publisher from "./publisher/index.js";
import consumer from "./consumer/index.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import RedisRouter from "./src/redis/exec.js";
import "dotenv/config.js";
import logger from "./logger/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ extended: false }));


// app.use("/api/redis", RedisRouter);

app.get("/", (req, res) => {
    logger.info('text info', { meta: 1 });
logger.warn('text warn');
logger.error('text error');
logger.error(new Error('something went wrong'));
    res.status(400).send("hello there");
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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log("App is running at port" + PORT);

    return;
    // connectQueue(function () {
    //     consumer();
    //     // RabbitClass.StartConsumer("test-queue", (msg, abc) => {
    //     //     console.log("msg", msg.content.toString());
    //     //     abc(true);
    //     // });
    //     publisher();
    //     // RabbitClass.StartPublisher("test-exchange", "direct", "test-queue");
    //     // RabbitClass.StartPublisher("exchange-test", "direct", "test-queue1");
    //     console.log("Rabbitmq connected");
    // });
});
