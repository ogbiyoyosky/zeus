/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    // console.log("connected to db");
    return db;
  } catch (error) {
    console.log(error);
    return console.log("fail to connect to the db");
  }
};

export default connect;
