import jwt from "jsonwebtoken";
import * as httpStatus from "http-status";

const secret = process.env.APP_SECRET_KEY;

const verifyToken = {
  verify(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Provid a valid token",
        status: "Unauthorized",
        status_code: httpStatus.UNAUTHORIZED,
      });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Not authorized",
          status: "Unauthorized",
          status_code: httpStatus.UNAUTHORIZED,
        });
      }

      // If everything is good, save to request for use in other routes
      req.id = decoded.id;
      req.role = decoded.role;
      return next();
    });
  },
};

export default verifyToken;
