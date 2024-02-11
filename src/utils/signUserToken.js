const jwt = require("./jwt");
const { secret } = require("../config");

exports.singUserToken = async (res, payload) => {
  const token = await jwt.sing(payload, secret, { expiresIn: "3d" });
  res.cookie("token", token, { httpOnly: true });
};
