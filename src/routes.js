const routes = require("express").Router();
const homeController = require("./_controllers/homeController");
const userController = require("./_controllers/userController");
const electronicsController = require("./_controllers/electronicsController");

routes.use(homeController);
routes.use("/user", userController);
routes.use("/electronics", electronicsController);

routes.use("*", (req, res) => {
  res.redirect("/404");
});

module.exports = routes;
