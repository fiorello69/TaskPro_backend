// import express from "express";
// import passport from "../../helpers/passport.js";
// import googleAuthController from "../../controllers/googleAuth.js";

// const router = express.Router();

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   googleAuthController.googleCallback
// );

// router.get("/logout", googleAuthController.googleLogout);

// router.get("/profile", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ message: "Not authenticated" });
//   }
//   res.json(req.user);
// });

// export default router;

// routes/api/googleAuth.js
import express from "express";
import passport from "../../helpers/passport.js";
import googleAuthController from "../../controllers/googleAuth.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthController.googleCallback
);

router.get("/logout", googleAuthController.googleLogout);

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

export default router;
