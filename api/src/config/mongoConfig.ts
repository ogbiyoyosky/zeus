require("dotenv").config();

const mongo_uri =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI
    : process.env.TEST_MONGO_URI;

const mongoConfig = {
  mongo_uri,
};

export default mongoConfig;
