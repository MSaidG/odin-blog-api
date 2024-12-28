export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
    // stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};
