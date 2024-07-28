async function googleCallback(_req, res) {
  res.redirect("/current");
}

async function googleLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export default {
  googleCallback,
  googleLogout,
};