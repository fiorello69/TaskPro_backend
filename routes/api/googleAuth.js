import express from "express";
import passport from "../../helpers/passport.js";

const router = express.Router();

// Ruta pentru inițierea autentificării cu Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Ruta pentru callback după autentificare
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (_req, res) => {
    // Succes autenticare, redirecționează utilizatorul
    res.redirect("/");
  }
);

// Ruta pentru logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Ruta protejată (de exemplu, profilul utilizatorului)
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

export default router;
