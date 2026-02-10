const validator = require("validator");

function validateCredentials(firstName, lastName, email, password) {
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
    );
  }
  return true;
}

module.exports = { validateCredentials };
