const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const { extractErrorMsg } = require("../utils/errorHanler");
const { singUserToken } = require("../utils/signUserToken");
const { isLogged } = require("../middlewares/authMiddlewares");

router.get("/register", isLogged, (req, res) => {
  res.render("user/register");
});

router.post("/register", isLogged, async (req, res) => {
  const { email, username, password, repeatPassword } = req.body;
  try {
    const newUser = await User.create({
      email,
      username,
      password,
      repeatPassword,
    });

    const payload = {
      _id: newUser._id,
      username,
      email,
    };

    await singUserToken(res, payload);
    res.redirect("/");
  } catch (err) {
    const errMessage = extractErrorMsg(err);
    res.render("user/register", {
      errMessage,
      email,
      username,
      password,
      repeatPassword,
    });
  }
});

router.get("/login", isLogged, (req, res) => {
  res.render("user/login");
});

router.post("/login", isLogged, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("email or password are invalid!");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("email or password are invalid!");
    }

    const payload = {
      _id: user._id,
      username: user.username,
      playing: user.playing,
      email,
    };

    await singUserToken(res, payload);
    res.redirect("/");
  } catch (err) {
    const errMessage = extractErrorMsg(err);

    res.render("user/login", { errMessage, email, password });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
