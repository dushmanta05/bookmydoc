module.exports = async function (req, res, next) {
  const userType = req.user?.userType;

  if (userType === "admin") {
    return next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Unauthorized access",
      error: "You do not have permission to access this resource",
    });
  }
};
