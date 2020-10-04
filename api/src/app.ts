import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./errors/application-error";
import routes from "./routes";
import connect from "./mongo-connection";
import { client } from "./redis-connection";

import MongoConnection from "./mongo-connection";
const app = express();
connect();
client();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

app.use(routes);

app.use(function (req, res, next) {
  return res.status(404).send({
    status: "Not Found",
    status_code: 404,
  });
});

app.use(
  (err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json({
      error: process.env.NODE_ENV === "development" ? err : undefined,
      message: err.message,
    });
  }
);

export default app;
