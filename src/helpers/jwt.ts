import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";
const createError = require("http-errors");
import { redisClient } from "../redis-connection";

function signAccessToken(payload) {
  return new Promise((resolve, reject) => {
    const secret = jwtConfig.appKey;

    const options = {
      expiresIn: "24h",
      issuer: "zeus",
      audience: payload.id,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
}

function signRefreshToken(payload) {
  return new Promise((resolve, reject) => {
    const secret = jwtConfig.refreshTokenKey;

    const options = {
      expiresIn: "1y",
      issuer: "zeus",
      audience: payload.id,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);
        reject(createError.InternalServerError());
        return;
      }
      redisClient.SET(
        payload.id,
        token,
        "EX",
        365 * 24 * 60 * 60,
        (err, reply) => {
          if (err) {
            reject(createError.InternalServerError());
            return;
          }
          resolve(token);
        }
      );
    });
  });
}

function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, jwtConfig.appKey, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}

function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, jwtConfig.refreshTokenKey, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.aud;
      redisClient.GET(userId, (err, result) => {
        if (err) {
          //reject(createError.InternalServerError());
          return;
        }

        if (refreshToken === result)
          return resolve({ id: userId, role: payload.role });
        reject(createError.Unauthorized());
      });
    });
  });
}

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
