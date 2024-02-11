const jwt = require("../utils/jwt");
const { secret } = require("../config");
const Electronic = require("../models/Electronic");

exports.auth = async (req, res, next) => {
  const token = req.cookies["token"];
  if (token) {
    try {
      const decodedToken = await jwt.verify(token, secret);
      req.user = decodedToken;

      res.locals.isAuth = true;
      next();
    } catch (err) {
      res.clearCookie("token");
      res.redirect("/user/login");
    }
  } else {
    next();
  }
};

exports.isAuth = (req, res, next) => {
  //checks for authenticated user
  if (!req.user) {
    res.redirect("/user/login");
    return;
  }
  next();
};

exports.isLogged = (req, res, next) => {
  //prevents logged users for accessing register/login pages
  if (req.user) {
    res.status(404).redirect("/404");
    return;
  }
  next();
};

exports.ownerProtect = async (req, res, next) => {
  //prevents users that are not the owner to edit and delete
  const { id } = req.params;
  const electronic = await Electronic.findById(id);

  if (electronic.owner.toString() !== req.user?._id) {
    res.status(404).redirect("/404");
    return;
  }
  next();
};
