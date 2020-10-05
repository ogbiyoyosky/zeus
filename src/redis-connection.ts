import { createClient } from "redis";
import logger from "./logger";
import redisConfig from "./config/redisConfig";

let redisClient;
const client = async () => {
  try {

    const client = await createClient(`redis://${redisConfig.url}`, {
      password: redisConfig.password
    });

    client.on("connect", () => {
      logger.info("Client connected to redis...");
    });

    client.on("ready", () => {
      logger.info(" Client connected to redis and ready to use... 🔥");
    });

    client.on("error", (err) => {
      logger.info(err.message);
    });

    client.on("end", () => {
      console.log("Client disconnected from redis");
    });
    redisClient = client;
    return client;
  } catch (error) {
    console.log(error);
    return console.log("fail to connect to the db");
  }
};
export { client, redisClient };
