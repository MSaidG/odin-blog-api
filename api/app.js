const express = require("express");
const app = express();
const {
  authenticateToken,
  authenticateTokenWithoutLock,
} = require("./controllers/authController");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorMiddleware");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: [`http://localhost:${PORT}`, "http://localhost:5173"],
    credentials: true,
  })
);

const blogMock = [
  {
    title: "Blog 1",
    overview: "This is blog 1",
    text: "This is blog 1",
    authorId: "f8c4b310-ea72-4df5-9c7a-348b361071fa",
  },
  {
    title: "Blog 2",
    overview: "This is blog 2",
    text: "This is blog 2",
    authorId: "f8c4b310-ea72-4df5-9c7a-348b361071fa",
  },
  {
    title: "Blog 3",
    overview: "This is blog 3",
    text: "This is blog 3",
    authorId: "f8c4b310-ea72-4df5-9c7a-348b361071fa",
  },
  {
    title: "Blog 4",
    overview: "This is blog 4",
    text: "This is blog 4",
    authorId: "f8c4b310-ea72-4df5-9c7a-348b361071fa",
  },
  {
    title: "Blog 5",
    overview: "This is blog 5",
    text: "This is blog 5",
    authorId: "f8c4b310-ea72-4df5-9c7a-348b361071fa",
  },
];

app.post("/api/blogs", async (req, res) => {
  const post = await prisma.post.create({
    data: {
      title: blogMock[0].title,
      overview: blogMock[0].overview,
      text: blogMock[0].text,
      authorId: blogMock[0].authorId,
    },
  });

  console.log(post);

  res.json(blogMock[0]);
});

app.get("/api/blogs", async (req, res) => {
  const posts = await prisma.post.findMany();
  console.log(posts);

  res.json(posts);
});

app.post("/auth/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const USERNAME = await prisma.user.findUnique({
    where: { username: username },
  });
  const EMAIL = await prisma.user.findUnique({ where: { email: email } });
  if (USERNAME) {
    console.log("This username is already taken");
    return res.redirect("/");
  } else if (EMAIL) {
    console.log("This email is already taken");
    return res.redirect("/");
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    await prisma.user
      .create({
        data: {
          username: username,
          email: email,
          password: hash,
        },
      })
      .then((response) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    console.log("User not found");
    return res.redirect("/");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("Invalid password");
    return res.redirect("/");
  }

  const accessToken = jwt.sign(
    { username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "3m",
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 20,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // path: "/auth/refresh",
    maxAge: 60 * 60 * 60,
  });

  res.redirect("/");
});

app.get("/auth/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.redirect("/");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.cookie("refreshToken", "", { maxAge: 0 });
      return res.redirect("/");
    }
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1m",
      }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "3m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 20,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      // path: "/auth/refresh",
      maxAge: 60 * 60 * 60,
    });
    res.redirect("/");
  });
});

app.get("/auth/logout", (req, res) => {
  res.cookie("accessToken", "", { maxAge: 0 });
  res.cookie("refreshToken", "", { maxAge: 0 });
  res.redirect("/");
});

app.get("/", authenticateTokenWithoutLock, (req, res) => {
  console.log("INDEX");
  res.render("index", {
    user: req.user,
  });
});

app.get("*", authenticateToken, (req, res, next) => {
  console.log("CATCH ALL?");
  console.log(req.user);
  if (!req.user) {
    res.redirect("/");
  }
  next();
});

app.get("/blogs", (req, res) => {
  res.render("blogs");
});

app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
