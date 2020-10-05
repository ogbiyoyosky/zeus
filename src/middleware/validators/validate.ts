import Joi from "@hapi/joi";
import logger from "../../logger";

const members = Joi.object().keys({
  name: Joi.string().required().trim().error(new Error("name is required")),
  position: Joi.string()
    .required()
    .trim()
    .error(new Error("position is required")),
});

const validator = {
  validateBody: (schema) => (req, res, next) => {
    //logger.info("body", req.body);
    const result = schema.validate(req.body);

    if (result.error) {
      return res.status(400).send({
        status: "bad request",
        status_code: 400,
        error: result.error.message,
      });
    }

    req.body = result.value;
    return next();
  },

  schemas: {
    authSchema: Joi.object().keys({
      firstName: Joi.string()
        .required()
        .trim()
        .lowercase()
        .error(new Error("firstName is required")),
      lastName: Joi.string()
        .required()
        .trim()
        .lowercase()
        .error(new Error("lastName is required")),
      email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .error(new Error("A valid email address is required")),
      password: Joi.string()
        .required()
        .error(new Error("Password is required")),
    }),
    authLoginSchema: Joi.object().keys({
      email: Joi.string()
        .required()
        .trim()
        .lowercase()
        .error(new Error("A valid email address is required")),
      password: Joi.string()
        .required()
        .error(new Error("Password is required"))
        .min(6)
        .error(new Error("Password must be a minimum of six characters")),
    }),
    createTeamSchema: Joi.object().keys({
      teamName: Joi.string()
        .required()
        .trim()
        .error(new Error("teamName name is required")),
      location: Joi.string()
        .required()
        .trim()
        .error(new Error("location name is required")),
      description: Joi.string()
        .required()
        .trim()
        .error(new Error("location name is required")),
      members: Joi.array()
        .required()
        .error(new Error("members are required"))
        .items(members),
    }),
    createFixtureSchema: Joi.object().keys({
      details: Joi.array().required(),
      homeTeam: Joi.array()
        .required()
        .error(new Error("Home team is required")),
      awayTeam: Joi.array()
        .required()
        .error(new Error("Away team is required")),
      status: Joi.string().trim(),
    }),
    updateScoresSchema: Joi.object().keys({
      homeTeamScore: Joi.number()
        .required()
        .error(new Error("Home score is required")),
      awayTeamScore: Joi.number()
        .required()
        .error(new Error("Away score is required")),
    }),
  },
};

export default validator;
