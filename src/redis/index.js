import client from "../../config/redis.js";

const redis = {
    async get(key) {
        const value = await client.get(key);
        return value;
    },
    async set(key, value) {
        await client.set(key, value);
    },
    async del(key) {
        await client.del(key);
    },
    async expire(key, seconds) {
        await client.expire(key, seconds);
    },
    async ttl(key) {
        const ttl = await client.ttl(key);
        return ttl;
    },
    async exists(key) {
        const exists = await client.exists(key);
        return exists;
    },
};

export default redis;
