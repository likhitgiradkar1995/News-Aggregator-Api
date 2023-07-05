const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  register,
  login,
  preference,
  updatePreference,
  news,
} = require("./Controllers/AuthController");
const verifyToken = require("./Middleware/authJWT");
const routes = require("express").Router();
require("dotenv").config();

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});

const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const PORT = 3000;

routes.post("/register", register);
routes.post("/login", login);
routes.get("/preferences", verifyToken, preference);
routes.put("/preferences/:id", verifyToken, updatePreference);
routes.get("/news", verifyToken, news);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
