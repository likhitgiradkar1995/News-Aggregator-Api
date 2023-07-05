const jwt = require("jsonwebtoken");
const usersData = require("../user.json");

const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.API_SECRET,
      function (err, decode) {
        if (err) {
          req.user = undefined;
          next();
        }
        const userFound = usersData?.users?.find(
          (user) => user.id == decode.id
        );

        if (userFound) {
          req.user = userFound;
          next();
        } else {
          res.status(500).send({
            message: "user not found",
          });
        }
      }
    );
  } else {
    req.user = undefined;
    req.message = "Authorization header not found";
    next();
  }
};
module.exports = verifyToken;
