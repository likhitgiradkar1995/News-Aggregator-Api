const usersData = require("../user.json");
const path = require("path");
const fs = require("fs");
const { default: axios } = require("axios");

const preference = (req, res) => {
  if (!req.user && req.message == null) {
    res.status(403).send({
      message: "Invalid JWT token",
    });
  } else if (!req.user && req.message) {
    res.status(403).send({
      message: req.message,
    });
  } else {
    res.status(200).send({
      user_preference: req.user.preference,
      message: "user preference fetched",
    });
  }
};

const updatePreference = (req, res) => {
  const userPreference = req.body;
  let userId = req.user.id;
  let writePath = path.join(__dirname, "..", "user.json");
  if (userPreference) {
    let userDataModified = JSON.parse(JSON.stringify(usersData));
    for (const user of userDataModified.users) {
      if (user.id == userId) {
        user.preference = userPreference?.preference || "";
        break;
      }
    }
    fs.writeFileSync(writePath, JSON.stringify(userDataModified), {
      encoding: "utf8",
      flag: "w",
    });
    res.status(200);
    res.json({ message: "user preference updated successfully!" });
  } else {
    res.status(400);
    res.json({ message: "preference data is empty" });
  }
};

const news = async (req, res) => {
  const response = await getNews(req.user.preference);
  if (response?.status == "200") {
    res.status(200);
    res.json(response?.data);
  } else if (response?.error) {
    res.status(400);
    res.json({ message: response?.error });
  } else {
    res.status(400);
    res.json({ message: "news data not available." });
  }
};

const getNews = async (preference) => {
  const options = {
    method: "GET",
    url: "https://news-api14.p.rapidapi.com/top-headlines",
    params: {
      category: preference,
    },
    headers: {
      "X-RapidAPI-Key": "fd1208e9c2msh6934a00d1b8735cp14c2f9jsn428a52b5abfb",
      "X-RapidAPI-Host": "news-api14.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (response?.data) {
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: error.code };
  }
};

module.exports = { preference, updatePreference, news };
