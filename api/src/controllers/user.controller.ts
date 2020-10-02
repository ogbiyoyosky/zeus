import { Request, Response, NextFunction } from "express";
import logger from "../logger";

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
      const { firstName, lastName, email, password } = req.body;

      logger.info("body", { firstName, lastName, email, password });
    } catch (error) {}
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
  ) {}

  public static async signIn(req: Request, res: Response, next: NextFunction) {}
}
export default UserController;
