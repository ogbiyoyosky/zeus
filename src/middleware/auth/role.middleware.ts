import * as httpStatus from "http-status";

const permissions = {
  adminOnly(req, res, next) {
    if (req.role === "ADMIN") {
      return next();
    }
    return res.send({
      message: "Not authorized",
      status: "Unauthorized",
      status_code: httpStatus.UNAUTHORIZED,
    });
  },
};

export default permissions;
