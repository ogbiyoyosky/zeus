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
  "/api/team",
  validate.validateBody(validate.schemas.createTeamSchema),
  TeamController.createTeam
);
router.get(
  "/api/team/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.viewTeam
);
router.put(
  "/api/team/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.editTeam
);
router.delete(
  "/api/team/:team_id",
  verifyToken.verify,
  permissions.adminOnly,
  TeamController.deleteTeam
);

router.post(
  "/fixtures",
  verifyToken.verify,
  permissions.adminOnly,
  validate.validateBody(validate.schemas.createFixtureSchema),
  FixtureController.addFixture
);

router.get(
  "/fixtures/:id",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.viewFixture
);

router.patch(
  "/fixtures/:id",
  verifyToken.verify,
  permissions.adminOnly,
  validate.validateBody(validate.schemas.createFixtureSchema),
  FixtureController.editFixture
);

router.delete(
  "/fixtures/:id",
  verifyToken.verify,
  permissions.adminOnly,
  FixtureController.deleteFixture
);

export default router;
