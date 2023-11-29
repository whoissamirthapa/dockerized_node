import redis from "./index.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const value = await redis.get("key");
    res.json({ value });
});

router.post("/add", async (req, res) => {
    const { key, value } = req.body;
    await redis.set(key, value);
    res.json({ success: true });
});

export default router;
