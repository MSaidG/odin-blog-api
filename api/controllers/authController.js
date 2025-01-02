const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader == null) {
    console.log("11: ");
    return res.sendStatus(401);
  }

  let accessToken = authHeader.split(" ")[1];

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
    console.log(req.user);
    next();
  });
};

const authenticateTokenWithoutLock = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader == null) {
    console.log("11: ");
  }

  let accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      next(err);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateTokenWithoutLock,
};

// let accessToken = authHeader && authHeader.split("=")[1];
// if (accessToken != null) {
//   authHeader.split(" ").forEach((cookie) => {
//     if (cookie.startsWith("accessToken")) {
//       accessToken = cookie.split("=")[1].split(";")[0];
//       console.log("11: " + accessToken);
//     }
//   });
// }
