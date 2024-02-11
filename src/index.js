const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require("path");

const { port, DB } = require("./config");
const routes = require("./routes");
const { auth } = require("./middlewares/authMiddlewares");

const app = express();

//express config
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.use(auth);

//handlebars config
app.engine("hbs", handlebars.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "src/views");

//database config

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successfull"))
  .catch((err) => console.log(`Error while connecting to DB: ${err}`));

//routes config
app.use(routes);

app.listen(port, () => console.log(`App is running on port: ${port} ... `));
