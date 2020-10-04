require("dotenv").config();

const redisConfig = {
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST,
};

export default redisConfig;
