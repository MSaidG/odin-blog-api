const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers);
  console.log(authHeader);

  let accessToken = authHeader.split(" ")[1];

  // let accessToken = authHeader && authHeader.split("=")[1];
  // if (accessToken != null) {
  //   authHeader.split(" ").forEach((cookie) => {
  //     if (cookie.startsWith("accessToken")) {
  //       accessToken = cookie.split("=")[1].split(";")[0];
  //       console.log("11: " + accessToken);
  //     }
  //   });
  // }
  console.log("22: " + accessToken);

  if (accessToken == null) {
    console.log("33: ");
    return res.sendStatus(401);
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
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
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateTokenWithoutLock,
};
