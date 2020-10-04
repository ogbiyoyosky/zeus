import { Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
import FixtureModel, { IFixture } from "../models/Fixture";
import * as httpStatus from "http-status";
import jwt from "jsonwebtoken";
import logger from "../logger";
import { uuid } from "uuidv4";

interface IFixtureArgs {
  homeTeam: [];
  awayTeam: [];
  details: [];
}

class FixtureController {
  /**
   * Add a fixture.
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static addFixture(req: Request, res: Response, next: NextFunction) {
    try {
      const { homeTeam, awayTeam, details } = req.body;

      FixtureModel.create<IFixtureArgs>({
        homeTeam,
        awayTeam,
        details,
      })
        .then((fixture) => {
          return res.status(httpStatus.CREATED).send({
            message: "Fixture successfully created",
            status: "created",
            status_code: httpStatus.CREATED,
            results: [fixture],
          });
        })
        .catch((err) => {
          console.log(err);
          logger.info(err);
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
   * View a Fixture
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async viewFixture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fixture_id } = req.params;

      FixtureModel.findOne({ _id: fixture_id })
        .then((fixture) => {
          if (!fixture)
            return res.status(httpStatus.BAD_REQUEST).send({
              message: "Fixture not found",
              status: "bad request",
              status_code: httpStatus.BAD_REQUEST,
            });

          return res.status(httpStatus.OK).send({
            message: "Successfully fetched the fixture",
            status: "ok",
            status_code: httpStatus.OK,
            results: [fixture],
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Fixture not found",
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
   * Search fixtures
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async search(req: Request, res: Response, next: NextFunction) {
    try {
      let { q, page, perPage } = req.query as any;

      //await FixtureModel.deleteMany({});

      perPage = perPage ? parseInt(perPage, 10) : 10;
      page = page ? parseInt(page, 10) : 1;

      const fixtures = await FixtureModel.find(
        {
          $text: {
            $search: q,
          },
        },
        {
          score: { $meta: "textScore" },
        }
      )
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();

      return res.status(httpStatus.OK).send({
        message: "Successfully  fetched all teams",
        status: "ok",
        status_code: httpStatus.OK,
        results: {
          fixtures,
          __meta: {
            count: fixtures.length,
            page,
            perPage,
          },
        },
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
   * Edit a Fixture
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async editFixture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fixture_id } = req.params;

      var options = {
        // Return the document after updates are applied
        new: true,
        // Create a document if one isn't found. Required for `setDefaultsOnInsert`
        upsert: true,
        setDefaultsOnInsert: true,
      };

      FixtureModel.findOneAndUpdate(
        {
          _id: fixture_id,
        },
        {
          ...req.body,
          modifiedAt: new Date(),
        },
        options
      )
        .then((team) => {
          return res.status(httpStatus.OK).send({
            message: "Successfully  updated the Fixture",
            status: "ok",
            status_code: httpStatus.OK,
            results: [team],
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Fixture not found",
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
   * View all Completed Fixture
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async completedFixture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { page, perPage } = req.query as any;

      perPage = perPage ? parseInt(perPage, 10) : 10;
      page = page ? parseInt(page, 10) : 1;
      const fixture = await FixtureModel.find({ status: "completed" })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();

      return res.status(httpStatus.OK).send({
        message: "Successfully  fetched all completed fixture",
        status: "ok",
        status_code: httpStatus.OK,
        results: fixture,
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
   * View all Completed Fixture
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async pendingFixture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { page, perPage } = req.query as any;

      perPage = perPage ? parseInt(perPage, 10) : 10;
      page = page ? parseInt(page, 10) : 1;
      const fixtures = await FixtureModel.find({ status: "pending" })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();

      return res.status(httpStatus.OK).send({
        message: "Successfully  fetched all pending fixture",
        status: "ok",
        status_code: httpStatus.OK,
        results: fixtures,
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
   * Delete a Fixture
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async deleteFixture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fixture_id } = req.params;
      FixtureModel.findOneAndDelete(
        {
          _id: fixture_id,
        },
        {
          ...req.body,
          deletedAt: new Date(),
        }
      )
        .then((fixture) => {
          return res.status(httpStatus.OK).send({
            message: "Successfully deleted the the fixture",
            status: "ok",
            status_code: httpStatus.OK,
          });
        })
        .catch((err) => {
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Fixture not found",
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
   * Generate a unique link for the fixture
   * @param {Object} req: url params
   * @param {Function} res: Express.js response callback
   * @param {Function} next: Express.js middleware callback
   * @author Emmanuel Ogbiyoyo
   * @public
   */

  public static async generateLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fixture_id } = req.params;
      const link = uuid();

      FixtureModel.findOneAndUpdate(
        {
          _id: fixture_id,
        },
        {
          generatedLink: link,
        }
      )
        .then((fixture) => {
          return res.status(httpStatus.OK).send({
            message:
              "Successfully generated a unique link for the fixture fixture",
            status: "ok",
            status_code: httpStatus.OK,
            results: [
              {
                fixture_link: `${process.env.BASE_URL}/api/fixtures/link/${link}`,
                fixture,
              },
            ],
          });
        })
        .catch((err) => {
          return res.status(httpStatus.BAD_REQUEST).send({
            message: "Fixture not found",
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
export default FixtureController;
