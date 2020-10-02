import { Router } from "express";

import UserController from "./controllers/user.controller";
import validate from "./middleware/helpers/validate";

const router = Router();

//Authentication Routes

router.post(
  "/api/auth/admin/register-user",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createUserAccount
);

router.post(
  "/api/auth/signin",
  validate.validateBody(validate.schemas.authLoginSchema),
  UserController.signIn
);

router.post(
  "/api/auth/user/register-admin",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createAdminAccount
);

export default router;
