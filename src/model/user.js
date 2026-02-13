const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      // match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email :" + value);
        }
      },
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password :" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not applicable (male, female, other)");
        }
      },
      // enum: {
      //   values: ["male", "female", "other"],
      //   message: `{VALUE} is not a valid gender type`,
      // },
    },
    imageURL: {
      type: String,
      default:
        "https://media.istockphoto.com/id/2041572395/vector/blank-avatar-photo-placeholder-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=wSuiu-si33m-eiwGhXiX_5DvKQDHNS--CBLcyuy68n0=",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
    },
    skills: {
      type: [String],
      default: [],
      // trim: true,
      set: (skills) => skills.map((skill) => skill.trim()),
      // validate: {
      //   validator: (arr) => arr.every((skill) => skill.trim().length > 0),
      //   message: "Skills cannot contain empty values",
      // },
    },
    about: {
      type: String,
      maxLength: 100,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SIGNATURE, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const hashedPassword = await bcrypt.hash(this.password, 10);
//   this.password = hashedPassword;
//   next();
// });

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
