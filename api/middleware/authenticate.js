const jwt = require('jsonwebtoken');

module.exports = async function authenticate(req, res, next) {
  const jwtToken = req.headers.authorization.replace('Bearer ', '');
  if (!jwtToken) {
    return res
      .status(401)
      .json({ status: false, message: 'No token provided' });
  }

  try {
    const decodedJwtToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = {
      id: decodedJwtToken.id,
      userType: decodedJwtToken.userType,
      email: decodedJwtToken.email,
      userName: decodedJwtToken.userName
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: 'invalid token' });
  }
};
