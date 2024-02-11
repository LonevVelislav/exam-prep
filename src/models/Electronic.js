const mongoose = require("mongoose");

const electronicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "name must be longer then 9 characters"],
  },
  type: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "type must be longer then 1 character"],
  },
  damages: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "damages must be longer then 9 characters"],
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value.startsWith("http://") || value.startsWith("https://");
      },
      message: "image must start with http:// or https://",
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "description length must be above 9 characters long"],
    maxLenght: [200, "description length must be below 200 characters long"],
  },
  production: {
    type: Number,
    required: true,
    min: [1900, "production must be after 1899"],
    max: [2023, "production must be before 2024"],
  },
  exploitation: { type: Number, required: true, min: [1, "exploitation value must be positive!"] },
  price: { type: Number, required: true, min: [1, "price must be positive number"] },
  buyingList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Electronic = mongoose.model("Electronic", electronicSchema);

module.exports = Electronic;
