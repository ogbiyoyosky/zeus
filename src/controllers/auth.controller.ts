import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/User";
import * as httpStatus from "http-status";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt";
import logger from "../logger";
import { redisClient } from "../redis-connection";

interface ILoginArgs {
  email: string;
  password: string;
}

class AuthController {
  /**
   * Generate token
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async generateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.body.token;

      if (!refreshToken)
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: "Provid a valid token",
          status: "Unauthorized",
          status_code: httpStatus.UNAUTHORIZED,
        });

      const verifiedData = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(verifiedData);
      const refToken = await signRefreshToken(verifiedData);

      return res.status(httpStatus.OK).send({
        message: "Successfully generated new credentials",
        status: "ok",
        status_code: httpStatus.OK,
        results: [{ accessToken: accessToken, refreshToken: refToken }],
      });
    } catch (error) {
      logger.info(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal Server Error",
        status: "Internal Server Error",
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Logout a user
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(httpStatus.BAD_REQUEST).send({
          message: "Provide a refresh token",
          status: "bad request",
          status_code: httpStatus.BAD_REQUEST,
        });
      const { id }: any = await verifyRefreshToken(refreshToken);

      redisClient.DEL(id, (err, val) => {
        if (err)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error",
            status: "Internal Server Error",
            status_code: httpStatus.INTERNAL_SERVER_ERROR,
          });

        return res.status(httpStatus.NO_CONTENT).send({
          message: "Successfully logged out",
          status: "ok",
          status_code: httpStatus.NO_CONTENT,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal Server Error",
        status: "Internal Server Error",
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Authenticate a user in the system
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: ILoginArgs = req.body;

      UserModel.findOne({ email }).then((user) => {
        if (!user) {
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Account not found",
            status: "bad request",
            status_code: httpStatus.BAD_REQUEST,
          });
        }

        user.comparePassword(password, async (err, isMatch) => {
          if (!isMatch || err) {
            return res.status(httpStatus.BAD_REQUEST).send({
              message: "Invalid email or password",
              status: "bad request",
              status_code: httpStatus.BAD_REQUEST,
            });
          }

          const accessToken = await signAccessToken({
            id: user.id,
            role: user.role,
          });
          const refreshToken = await signRefreshToken({
            id: user.id,
            role: user.role,
          });

          return res.status(httpStatus.OK).send({
            message: "Successfully logged In",
            status: "ok",
            status_code: httpStatus.OK,
            results: [{ user: user.toJSON(), accessToken, refreshToken }],
          });
        });
      });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal Server Error",
        status: "Internal Server Error",
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
export default AuthController;
