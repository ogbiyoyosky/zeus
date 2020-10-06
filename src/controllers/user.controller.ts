import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/User";
import * as httpStatus from "http-status";
import logger from "../logger";

interface IUserArgs {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

class UserController {
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
      const { firstName, lastName, email, password }: IUserArgs = req.body;

      UserModel.create<IUserArgs>({
        firstName,
        lastName,
        email,
        password,
        role: "USER",
      })
        .then((user) => {
          logger.info("User Account successfully created");
          return res.status(httpStatus.CREATED).send({
            message: "Account successfully created",
            status: "created",
            status_code: httpStatus.CREATED,
          });
        })
        .catch((err) => {
          logger.info("Account already exist", err.message);
          return res.status(httpStatus.CONFLICT).send({
            message: "Account already exist",
            status: "conflict",
            status_code: httpStatus.CONFLICT,
          });
        });
    } catch (err) {
      logger.info("Internal server error", err.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal Server Error",
        status: "Internal Server Error",
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Create a admin in the database
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */
  public static async createAdminAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { firstName, lastName, email, password }: IUserArgs = req.body;

      UserModel.create<IUserArgs>({
        firstName,
        lastName,
        email,
        password,
        role: "ADMIN",
      })
        .then((user) => {
          logger.info("Admin Account successfully created");

          return res.status(httpStatus.CREATED).send({
            message: "Account successfully created",
            status: "created",
            status_code: httpStatus.CREATED,
          });
        })
        .catch((err) => {
          logger.info(err.message);
          return res.status(httpStatus.CONFLICT).send({
            message: "Account already exist",
            status: "conflict",
            status_code: httpStatus.CONFLICT,
          });
        });
    } catch (err) {
      logger.info("Internal server error", err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal Server Error",
        status: "Internal Server Error",
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
export default UserController;
