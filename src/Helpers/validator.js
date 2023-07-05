const userValidator = (userData, newUser) => {
  if (
    newUser.hasOwnProperty("name") &&
    newUser.hasOwnProperty("email") &&
    newUser.hasOwnProperty("password")
  ) {
    let sameEmailIdFound = userData.users.some(
      (user) => user.email == newUser.email
    );

    console.log("sameEmailIdFound >> ", sameEmailIdFound);

    if (sameEmailIdFound) {
      return {
        status: false,
        message: "User with same email id already exists",
      };
    } else {
      return {
        status: true,
        message: "User registered successfully !",
      };
    }
  } else {
    return {
      status: false,
      message: "user Info is malformed please provide all the properties",
    };
  }
};

module.exports = { userValidator: userValidator };
