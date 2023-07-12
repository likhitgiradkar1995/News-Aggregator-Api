var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const usersData = require("../user.json");
const path = require("path");
const fs = require("fs");
const { userValidator } = require("../Helpers/validator");
const shortid = require("shortid");

const register = (req, res) => {
  const userDetail = {
    id: shortid.generate(),
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    preference: req.body.preference,
  };
  let writePath = path.join(__dirname, "..", "user.json");
  const validate = userValidator(usersData, userDetail);
  if (validate.status) {
    let userDataModified = JSON.parse(JSON.stringify(usersData));
    userDataModified.users.push(userDetail);
    fs.writeFileSync(writePath, JSON.stringify(userDataModified), {
      encoding: "utf8",
      flag: "w",
    });
    res.status(200);
    res.json(validate);
  } else {
    res.status(400);
    res.json(validate);
  }
};

const login = (req, res) => {
  const userFound = usersData.users.find(
    (user) => user.email == req.body.email
  );

  // checking user is available in datastore
  if (userFound) {
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      userFound.password
    );
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    //signing token with user id
    var token = jwt.sign(
      {
        id: userFound.id,
      },
      process.env.API_SECRET,
      {
        expiresIn: 86400,
      }
    );

    //responding to client request with user profile success message and  access token .
    res.status(200).send({
      user: {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
      },
      message: "Login successfull",
      accessToken: token,
    });
  } else {
    return res.status(404).send({
      message: "User Not found.",
    });
  }
};

module.exports = { register, login };
