/* eslint-disable import/first */
import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: ".env.default" });
}

import app from "./app";
import logger from "./logger";

app.listen(app.get("port"), (): void => {
  console.log(
    "\x1b[36m%s\x1b[0m", // eslint-disable-line
    `🌏 Express server started at http://localhost:${app.get("port")}`
  );
});
