function trimWhitespace(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
  }
  return obj;
}

function checkNullValues(obj) {
  const nullValues = [];
  for (const key in obj) {
    if (obj[key] === null || obj[key] === "") {
      nullValues.push(key);
    }
  }
  if (nullValues.length > 0) {
    const fields = nullValues.map((field) => `'${field}'`).join(", ");
    return {
      status: false,
      message: `${fields} cannot be null or empty`,
      error: "null value error",
    };
  }
  return { status: true };
}

function checkRequiredFields(reqBody, requiredFields) {
  const missingFields = [];
  for (const field of requiredFields) {
    if (!reqBody.hasOwnProperty(field)) {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    return {
      status: false,
      message: `${missingFields.join(", ")} fields are required`,
      error: "missing required fields",
    };
  }
  return { status: true };
}

function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: false,
      message: "Invalid email format",
      error: "Validation error",
    };
  }
  return { status: true };
}

module.exports = {
  trimWhitespace,
  checkNullValues,
  checkRequiredFields,
  isEmailValid,
};
