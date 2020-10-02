import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/User";
import * as httpStatus from "http-status";
import jwt from "jsonwebtoken";
import logger from "../logger";

interface ILoginArgs {
  email: string;
  password: string;
}

class AuthController {
  /**
   * Create a user in the database
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async createUserAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  /**
   * Create a user in the database
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch || err) {
            return res.status(httpStatus.BAD_REQUEST).send({
              message: "Invalid email or password",
              status: "bad request",
              status_code: httpStatus.BAD_REQUEST,
            });
          }

          // Generate token
          const token = jwt.sign(
            {
              id: user.id,
              role: user.role,
            },
            process.env.APP_SECRET_KEY,
            {
              expiresIn: process.env.JWT_EXPIRATION, // expires in 24 hours
            }
          );

          return res.status(httpStatus.OK).send({
            message: "Successfully logged in",
            status: "ok",
            status_code: httpStatus.OK,
            results: [{ user: user.toJSON(), token, type: "bearer" }],
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
