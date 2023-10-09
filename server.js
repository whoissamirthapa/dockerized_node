import express from "express";
import { connectQueue } from "./config/rabbitmq.js";
import { sendData } from "./rabbitmq/index.js";
import { RabbitClass } from "./rabbitmq/pubSub.js";
import publisher from "./publisher/index.js";
import consumer from "./consumer/index.js";
import morgan from "morgan";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import winston from "winston";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ extended: false }));
// app.use(morgan("tiny"));
// app.use(
//     morgan(":method :host :url :status :res[content-length] - :response-time ms")
// );

// app.use(
//     morgan(
//         "combined",
//         {
//             skip: function (req, res) {
//                 return res.statusCode < 400;
//             },
//         },
//         function (tokens, req, res) {
//             return [
//                 tokens.method(req, res),
//                 tokens.url(req, res),
//                 tokens.status(req, res),
//                 tokens.res(req, res, "content-length"),
//                 "-",
//                 tokens["response-time"](req, res),
//                 "ms",
//             ].join(" ");
//         }
//     )
// );
// var accessLogStream = fs.createWriteStream(path.join(__dirname, "./logs/access.log"), {
//     flags: "a",
// });

// // setup the logger
// app.use(morgan("combined", { stream: accessLogStream }));

const logger = new winston.Logger({
    levels: winston.config.npm.levels,
    // format: winston.format.json(),
    format: winston.format.combine(
        // winston.format.colorize(),
        // winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
            // console.log("info", info);
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "./logs/all-logs.log",
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
        }),
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            // format: winston.format.simple(),
            json: false,
            colorize: true,
        }),
    ],
    exitOnError: false,
});

// logger.stream = {
//     write: function (message, encoding) {
//         if (message.includes("favicon.ico")) return;
//         // console.log("message", message);
//         logger.info(message + "\n");
//         // console.log("encoding", encoding);
//         // logger.info(message);
//         // logger.info(encoding);
//     },
// };

app.use(
    morgan("combined", {
        stream: {
            write: function (message, encoding) {
                if (message.includes("favicon.ico")) return;
                logger.log("info", message);
            },
        },
    })
);

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
    return;
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
