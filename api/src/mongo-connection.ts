/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";
import mongoConfig from "./config/mongoConfig";
import logger from "./logger";

dotenv.config();

const connect = async () => {
  try {
    const db = await mongoose.connect(mongoConfig.mongo_uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    logger.info("connected to db 🔥");
    return db;
  } catch (error) {
    console.log(error);
    return console.log("fail to connect to the db");
  }
};

export default connect;
