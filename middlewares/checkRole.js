const ApiError = require("../utils/apiError.js");

exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    const userRole = req.userRole;

    if (!userRole || !roles.includes(userRole)) {
      return next(new ApiError("ليس لديك الإذن للقيام بهذا الإجراء", 403));
    }
    next();
  };
