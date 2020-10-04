import jwt from "jsonwebtoken";
import * as httpStatus from "http-status";

const secret = process.env.APP_SECRET_KEY;

const verifyToken = {
  verify(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: "Provid a valid token",
        status: "Unauthorized",
        status_code: httpStatus.UNAUTHORIZED,
      });
    }

    const authToken = token.split(" ")[1];

    jwt.verify(authToken, secret, (err, decoded) => {
      console.log(err);
      if (err) {
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: "Not authorized",
          status: "Unauthorized",
          status_code: httpStatus.UNAUTHORIZED,
        });
      }
      console.log(decoded);
      // If everything is good, save to request for use in other routes
      req.id = decoded.id;
      req.role = decoded.role;
      return next();
    });
  },
};

export default verifyToken;
