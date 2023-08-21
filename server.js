import express from "express";
import { connectQueue } from "./config/rabbitmq.js";
import { sendData } from "./rabbitmq/index.js";

const app = express();
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    res.send("hello there");
});

app.post("/api/send-data-to-queue", async (req, res) => {
    const data = req.body;
    if (!data) return res.status(400).json({ success: false, msg: "No data" });
    // send data to queue
    const resFinal = await sendData(data);
    if (resFinal?.success) {
        return res.status(200).json({ success: true, data: resFinal });
    }
});

app.get("/api/v1", (req, res) => {
    res.status(200).json({ msg: "hello there from api" });
});

app.listen(5000, () => {
    console.log("App is running at port" + 5000);
    connectQueue();
});

// app.get("/api/recieve-data-from-queue", async (req, res) => {
//     // send data to queue
//     const data = await recieveData();
//     if (!data) return res.status(400).json({ success: false, msg: "No data" });
//     console.log("recieved in api", data);
//     return res.status(200).json({ success: true, data });
// });
