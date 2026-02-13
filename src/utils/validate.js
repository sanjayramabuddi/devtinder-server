const validator = require("validator");

function validateSignup(firstName, lastName, email, password) {
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

function validateEditUser(req) {
  const allowedEdits = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "imageURL",
    "skills",
    "about",
  ];
  // const {firstName, lastName, age, gender, imageURL, skills, about} = req;
  const isAllowed = Object.keys(req.body).every(
    (field) => allowedEdits.includes(field),      // .every => checking
  );
  return isAllowed;
}

module.exports = { validateSignup, validateEditUser };
