require("dotenv").config();

let mongo_uri;

if (process.env.NODE_ENV != "test") {
  mongo_uri = process.env.MONGO_URI;
} else {
  mongo_uri = process.env.TEST_MONGO_URI;
}

console.log({ mongo_uri });

const mongoConfig = {
  mongo_uri,
};

export default mongoConfig;
