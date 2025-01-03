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
    origin: [
      `http://localhost:${PORT}`,
      "http://localhost:5173",
      "http://localhost:5173/#",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.get("/api/posts/:postId/comments", async (req, res) => {
  const comments = await prisma.comment
    .findMany({
      where: {
        postId: parseInt(req.params.postId),
      },
      include: {
        user: true,
      },
      orderBy: {
        time: "desc",
      },
    })
    .then((comments) => {
      res.json(comments);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.get("/api/posts/:postId", async (req, res) => {
  const post = await prisma.post
    .findUnique({
      where: {
        id: parseInt(req.params.postId),
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        Comment: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post(
  "/api/users/:userId/posts/:postId/comments",
  authenticateToken,
  async (req, res) => {
    const { userId, postId } = req.params;
    const { text } = req.body;
    const comment = await prisma.comment
      .create({
        data: {
          text: text,
          userId: userId,
          postId: parseInt(postId),
        },
      })
      .then((comment) => {
        res.json(comment);
      })
      .catch((error) => {
        console.log(error.message);
        res.json(error.message);
      });
  }
);

app.get("/api/users/:userId/posts/:postId/comments", async (req, res) => {
  const { userId, postId } = req.params;
  const comment = await prisma.comment
    .findFirst({
      where: {
        userId: userId,
        postId: parseInt(postId),
      },
      include: {
        user: true,
      },
      orderBy: {
        time: "desc",
      },
    })
    .then((comment) => {
      res.json(comment);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.get("/api/blogs", async (req, res) => {
  const posts = await prisma.post
    .findMany()
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.delete(
  "/api/user/:username/posts/:postId",
  authenticateToken,
  async (req, res) => {
    const { username, postId } = req.params;
    const post = await prisma.post
      .delete({
        where: {
          id: parseInt(postId),
        },
      })
      .then((post) => {
        res.json(post);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
);

app.put(
  "/api/user/:username/posts/:postId",
  authenticateToken,
  async (req, res) => {
    const { username, postId } = req.params;
    const { title, text, overview } = req.body;
    const post = await prisma.post
      .update({
        where: {
          id: parseInt(postId),
        },
        data: {
          title: title,
          text: text,
          overview: overview,
        },
      })
      .then((post) => {
        res.json(post);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
);

app.post("/api/user/:username/posts", authenticateToken, async (req, res) => {
  const { username } = req.params;
  const { title, text, overview } = req.body;
  const post = await prisma.post
    .create({
      data: {
        title: title,
        text: text,
        overview: overview,
        author: {
          connect: {
            username: username,
          },
        },
      },
    })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.get("/auth/check", authenticateTokenWithoutLock, async (req, res) => {
  res.status(200).json({ message: "Authorized" });
});

/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

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

  if (!username || !password) {
    console.log("Missing username or password");
    return res.json({ message: "Missing username or password" });
  }
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    console.log("User not found");
    return res.status(404).json({ message: "User not found" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("Invalid password");
    return res.status(404).json({ message: "Invalid password" });
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
    // httpOnly: true,
    // secure: true,
    sameSite: "strict",
    domain: "localhost",
    path: "/",
    maxAge: 60 * 60 * 20,
  });

  res.cookie("refreshToken", refreshToken, {
    // httpOnly: true,
    // secure: true,
    sameSite: "strict",
    domain: "localhost",
    path: "/",
    // path: "/auth/refresh",
    maxAge: 60 * 60 * 60,
  });

  res.status(200).json({ message: "Login successful" });
});

app.get("/auth/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.redirect("http://localhost:5173/");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.cookie("refreshToken", "", { maxAge: 0 });
      return res.redirect("http://localhost:5173/");
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
      // httpOnly: true,
      // secure: true,
      sameSite: "strict",
      domain: "localhost",
      path: "/",
      maxAge: 60 * 60 * 20,
    });
    res.cookie("refreshToken", refreshToken, {
      // httpOnly: true,
      // secure: true,
      sameSite: "strict",
      domain: "localhost",
      path: "/",
      // path: "/auth/refresh",
      maxAge: 60 * 60 * 60,
    });
    res.redirect("http://localhost:5173/");
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
