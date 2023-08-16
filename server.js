import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("hello there");
});

app.get("/api/v1", (req, res) => {
    res.status(200).json({ msg: "hello there from api" });
});

app.listen(5000, () => {
    console.log("App is running at port" + 5000);
});
