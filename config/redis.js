import { createClient } from "redis";

const client = await createClient({
    url: "redis://localhost:6379",
})
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

await client.set("key", "value");
const value = await client.get("key");
console.log(value);
await client.disconnect();

export default client;
