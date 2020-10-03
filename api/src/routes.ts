import { Router } from "express";

import UserController from "./controllers/user.controller";
import FixtureController from "./controllers/fixture.controller";
import AuthController from "./controllers/auth.controller";
import TeamController from "./controllers/team.controller";
import validate from "./middleware/helpers/validate";
import verifyToken from "./middleware/auth/token.middleware";
import permissions from "./middleware/auth/role.middleware";

const router = Router();

//Authentication Route

router.post(
  "/api/auth/user/register",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createUserAccount
);

router.post(
  "/api/auth/signin",
  validate.validateBody(validate.schemas.authLoginSchema),
  AuthController.authenticate
);

router.post(
  "/api/auth/admin/register",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createAdminAccount
);

router.post(
  "/api/teams",
  validate.validateBody(validate.schemas.createTeamSchema),
  TeamController.createTeam
);

router.get("/api/teams", TeamController.allTeam);
router.get(
  "/api/teams/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.viewTeam
);
router.put(
  "/api/teams/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.editTeam
);

router.delete(
  "/api/teams/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.deleteTeam
);

router.post(
  "/api/fixtures",
  verifyToken.verify,
  permissions.adminOnly,
  validate.validateBody(validate.schemas.createFixtureSchema),
  FixtureController.addFixture
);

router.get(
  "/api/fixtures/completed",
  verifyToken.verify,
  FixtureController.completedFixture
);

router.get(
  "/api/fixtures/pending",
  verifyToken.verify,
  FixtureController.pendingFixture
);

router.get(
  "/api/fixtures/:fixture_id",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.viewFixture
);

router.put(
  "/api/fixtures/:fixture_id",
  verifyToken.verify,
  permissions.adminOnly,
  validate.validateBody(validate.schemas.createFixtureSchema),
  FixtureController.editFixture
);

router.delete(
  "/api/fixtures/:fixture_id",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.deleteFixture
);

router.get(
  "/api/fixtures/:fixture_id/generate-link",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.generateLink
);

export default router;
