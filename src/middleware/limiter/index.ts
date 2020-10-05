import rateLimit from "express-rate-limit";

const handler = function (req, res /*next*/) {
  res.status(429).send({
    message:
      "Too many accounts created from this IP, please try again after an hour",
    status: "Too Many Requests",
    status_code: 429,
  });
};
export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 10000000,
  handler: handler,
  headers: true,
});
