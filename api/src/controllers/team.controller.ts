import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
import TeamModel, { ITeam } from "../models/Team";
import * as httpStatus from "http-status";
import jwt from "jsonwebtoken";
import logger from "../logger";

interface ITeamArgs {
  _id: any;
  teamName: string;
  location: string;
  members: Array<any>;
  description: string;
}

class TeamController {
  /**
   * Create a team in the database
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { teamName, members, description, location } = req.body;

      TeamModel.create<ITeamArgs>({
        teamName,
        members,
        location,
        description,
      })
        .then((team) => {
          logger.info("Admin Account asuccessfully created", team);

          return res.status(httpStatus.CREATED).send({
            message: "Team successfully created",
            status: "created",
            status_code: httpStatus.CREATED,
            results: [team],
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.name === "ValidationError") {
            return res.status(httpStatus.BAD_REQUEST).send({
              message: err.message,
              status: "bad request",
              status_code: httpStatus.BAD_REQUEST,
            });
          }

          if (err.name === "MongoError") {
            return res.status(httpStatus.BAD_REQUEST).send({
              message: "Team already exist",
              status: "bad request",
              status_code: httpStatus.BAD_REQUEST,
            });
          }
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

  /**
   * View a Team
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async viewTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { team_id } = req.params;

      TeamModel.findOne({ _id: team_id })
        .then((team) => {
          if (!team)
            return res.status(httpStatus.BAD_REQUEST).send({
              message: "Team not found",
              status: "bad request",
              status_code: httpStatus.BAD_REQUEST,
            });

          return res.status(httpStatus.OK).send({
            message: "Successfully  fetched the team",
            status: "ok",
            status_code: httpStatus.OK,
            results: [team],
          });
        })
        .catch((err) => {
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Team not found",
            status: "bad request",
            status_code: httpStatus.BAD_REQUEST,
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
   * View all Team
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async allTeam(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, perPage } = req.query as any;

      perPage = perPage ? parseInt(perPage, 10) : 10;
      page = page ? parseInt(page, 10) : 1;
      const teams = await TeamModel.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();

      return res.status(httpStatus.OK).send({
        message: "Successfully  fetched all teams",
        status: "ok",
        status_code: httpStatus.OK,
        results: [teams],
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
   * Edit a Team
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async editTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { team_id } = req.params;

      var options = {
        // Return the document after updates are applied
        new: true,
        // Create a document if one isn't found. Required for `setDefaultsOnInsert`
        upsert: true,
        setDefaultsOnInsert: true,
      };

      TeamModel.findOneAndUpdate(
        {
          _id: team_id,
        },
        {
          ...req.body,
          modifiedAt: new Date(),
        },
        options
      )
        .then((team) => {
          return res.status(httpStatus.OK).send({
            message: "Successfully  updated the team",
            status: "ok",
            status_code: httpStatus.OK,
            results: [team],
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Team not found",
            status: "bad request",
            status_code: httpStatus.BAD_REQUEST,
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

  /**
   * Delete a Team
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async deleteTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { team_id } = req.params;
      TeamModel.findOneAndDelete(
        {
          _id: team_id,
        },
        {
          ...req.body,
          deletedAt: new Date(),
        }
      )
        .then((team) => {
          return res.status(httpStatus.OK).send({
            message: "Successfully deleted the team",
            status: "ok",
            status_code: httpStatus.OK,
          });
        })
        .catch((err) => {
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Team not found",
            status: "bad request",
            status_code: httpStatus.BAD_REQUEST,
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
export default TeamController;
