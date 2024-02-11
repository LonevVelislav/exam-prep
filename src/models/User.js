const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "email must at least 10 characters long"],
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "username must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [4, "password must be at least 4 characters long"],
  },
});

userSchema.virtual("repeatPassword").set(function (value) {
  if (value !== this.password) {
    throw new Error("passwords must match!");
  }
});

userSchema.pre("save", async function (next) {
  const users = await mongoose.model("User").find();
  if (users.some((el) => el.email === this.email)) {
    throw new Error("email in use!");
  }
  next();
});

userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
