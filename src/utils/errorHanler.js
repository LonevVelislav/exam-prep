const { MongooseError } = require("mongoose");

exports.extractErrorMsg = (err) => {
  if (err instanceof MongooseError) {
    const msgs = Object.values(err.errors).map((el) => el.message);
    return msgs[0];
  }
  return err.message;
};
