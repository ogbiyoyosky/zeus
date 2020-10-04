import { createClient } from "redis";
import logger from "./logger";

const client = createClient({
  port: 6379,
  host: "127.0.0.1",
});

client.on("connect", () => {
  logger.info("Client connected to redis...");
});

client.on("ready", () => {
  logger.info("🔥 Client connected to redis and ready to use...");
});

client.on("error", (err) => {
  logger.info(err.message);
});

client.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

export default client;
