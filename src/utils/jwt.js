const jsonwebtoken = require("jsonwebtoken");
const { promisify } = require("util");

const jwt = {
  sing: promisify(jsonwebtoken.sign),
  verify: promisify(jsonwebtoken.verify),
};

module.exports = jwt;
