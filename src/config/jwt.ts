require("dotenv").config();

const jwtConfig = {
  appKey: process.env.APP_SECRET_KEY,
  refreshTokenKey: process.env.REFRESH_SECRET_KEY,
};

export default jwtConfig;
