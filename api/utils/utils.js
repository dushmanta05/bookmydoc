function checkRequiredFields(res, reqBody, requiredFields) {
  const missingFields = [];
  for (const field of requiredFields) {
    if (!reqBody.hasOwnProperty(field)) {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: `${missingFields.join(", ")} fields are required`,
      error: "missing required fields",
    });
  }
  return null;
}

function isEmailValid(res, email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Invalid email format",
      error: "Validation error",
    });
  }
  return null;
}

function trimWhitespace(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
  }
  return obj;
}

module.exports = {
  checkRequiredFields,
  isEmailValid,
  trimWhitespace,
};
