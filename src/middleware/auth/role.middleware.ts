import * as httpStatus from "http-status";

const permissions = {
  adminOnly(req, res, next) {
    console.log(req.role);
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
