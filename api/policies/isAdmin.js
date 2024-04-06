module.exports = async function (req, res, next) {
  const isAdmin = req.body.isAdmin;

  if (isAdmin) {
    return next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Unauthorized access",
      error: "You do not have permission to access this resource",
    });
  }
};
