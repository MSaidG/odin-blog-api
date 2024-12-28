const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.cookie;
  let accessToken = authHeader && authHeader.split("=")[1];
  if (accessToken != null) {
    authHeader.split(" ").forEach((cookie) => {
      if (cookie.startsWith("accessToken")) {
        accessToken = cookie.split("=")[1].split(";")[0];
        console.log("11: " + accessToken);
      }
    });
    const mySubString = accessToken.substring(0, accessToken.lastIndexOf(";"));
    console.log(mySubString);
  }

  if (accessToken == null) {
    console.log("33: ");
    return res.sendStatus(401);
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const authenticateTokenWithoutLock = (req, res, next) => {
  const authHeader = req.headers.cookie;
  let accessToken = authHeader && authHeader.split("=")[1];
  if (accessToken != null) {
    authHeader.split(" ").forEach((cookie) => {
      if (cookie.startsWith("accessToken")) {
        accessToken = cookie.split("=")[1].split(";")[0];
        console.log("22: " + accessToken);
      }
    });
    const mySubString = accessToken.substring(0, accessToken.lastIndexOf(";"));
    console.log(mySubString);
  }

  // if (accessToken == null) {
  //   console.log("33: ");
  //   return res.sendStatus(401);
  // }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // if (err) {
    //   return res.sendStatus(403);
    // }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateTokenWithoutLock,
};
