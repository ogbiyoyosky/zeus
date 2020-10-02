import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/User";
import * as httpStatus from "http-status";
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
  ) {
    try {
      const { email, password }: ILoginArgs = req.body;
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal Server Error",
        status: "Internal Server Error",
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

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
  ) {}
}
export default AuthController;
