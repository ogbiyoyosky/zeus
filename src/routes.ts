import { Router } from "express";

import UserController from "./controllers/user.controller";
import FixtureController from "./controllers/fixture.controller";
import AuthController from "./controllers/auth.controller";
import TeamController from "./controllers/team.controller";
import validate from "./middleware/validators/validate";
import verifyToken from "./middleware/auth/token.middleware";
import permissions from "./middleware/auth/role.middleware";

const router = Router();

router.get("/welcome", (req, res) => {
  return res.status(200).send({
    message: "welcome to epl api",
  });
});

router.get("/", (req, res) => {
  return res.status(200).send({
    message: "welcome to epl api",
  });
});

/**
 * @register - register a user
 */
router.post(
  "/api/auth/register",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createUserAccount
);
/**
 * @sigin - sign in a user
 */
router.post(
  "/api/auth/signin",
  validate.validateBody(validate.schemas.authLoginSchema),
  AuthController.authenticate
);

/**
 * @logout
 */
router.post("/api/auth/logout", AuthController.logout);

/**
 * @generateRefreshTohen
 */
router.post("/api/auth/refresh-token", AuthController.generateToken);

/**
 * @adminRegister
 */
router.post(
  "/api/auth/admin/register",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createAdminAccount
);

/**
 * @createTeam
 */
router.post(
  "/api/teams",
  validate.validateBody(validate.schemas.createTeamSchema),
  TeamController.createTeam
);

/**
 * @searchTeam
 */
router.get("/api/teams/search", TeamController.search);

/**
 * @fetchTeams
 */
router.get("/api/teams", verifyToken.verify, TeamController.allTeam);

/**
 * @viewSignTeam
 */
router.get("/api/teams/:team_id", verifyToken.verify, TeamController.viewTeam);

/**
 * @editTeam
 */
router.put(
  "/api/teams/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.editTeam
);

/**
 * @deleteTeam
 */
router.delete(
  "/api/teams/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.deleteTeam
);

/**
 * @addFixture
 */
router.post(
  "/api/fixtures",
  verifyToken.verify,
  permissions.adminOnly,
  validate.validateBody(validate.schemas.createFixtureSchema),
  FixtureController.addFixture
);

/**
 * @searchFixture
 */
router.get("/api/fixtures/search", FixtureController.search);

/**
 * @getFixtureCompleted
 */
router.get(
  "/api/fixtures/completed",
  verifyToken.verify,
  FixtureController.completedFixture
);

/**
 * @getFixturePending
 */
router.get(
  "/api/fixtures/pending",
  verifyToken.verify,
  FixtureController.pendingFixture
);

/**
 * @viewSingleFixture
 */
router.get(
  "/api/fixtures/:fixture_id",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.viewFixture
);

/**
 * @editFixture
 */
router.put(
  "/api/fixtures/:fixture_id",
  verifyToken.verify,
  permissions.adminOnly,
  validate.validateBody(validate.schemas.createFixtureSchema),
  FixtureController.editFixture
);

/**
 * @deleteFixture
 */
router.delete(
  "/api/fixtures/:fixture_id",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.deleteFixture
);

/**
 * @generateFixtureLink
 */
router.get(
  "/api/fixtures/:fixture_id/generate-link",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.generateLink
);

/**
 * @fetchAllFixtures
 */
router.get("/api/fixtures", verifyToken.verify, FixtureController.allFixtures);

/**
 * @getFixtureByLink
 */
router.get(
  "/api/fixtures/link/:unique_code",
  FixtureController.getFixtureByLink
);

export default router;
