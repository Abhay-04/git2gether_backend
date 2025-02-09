const auth = (req, res, next) => {
  const token = "145236";

  const isAuthorized = token === "145236";

  if (isAuthorized) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { auth };
