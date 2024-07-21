import express from "express";
import authController from "../../controllers/auth.js";
import authenticate from "../../middlewares/authenticate.js";
import validateBody from "../../middlewares/validateBody.js";
import schemas from "../../models/validation-schemas/user-validation.js";
import uploadCloud from "../../middlewares/uploadMiddlewares.js";

const { registerSchema, loginSchema, refreshSchema, themeSchema, helpSchema } =
  schemas;
const router = express.Router();

router.post("/register", validateBody(registerSchema), authController.register);

router.post("/login", validateBody(loginSchema), authController.login);

router.post("/refresh", validateBody(refreshSchema), authController.refresh);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

router.patch(
  "/theme",
  authenticate,
  validateBody(themeSchema),
  authController.updateTheme
);

router.put(
  "/profile",
  authenticate,
  uploadCloud.single("avatarURL"),
  validateBody(registerSchema),
  authController.updateProfile
);

router.post(
  "/help",
  authenticate,
  validateBody(helpSchema),
  authController.getHelpEmail
);

export default router;
