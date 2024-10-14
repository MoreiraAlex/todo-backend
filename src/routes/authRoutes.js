const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");
const { validateInputs } = require("../utils/validators");

const router = express.Router();

router.post("/register",
  body('username').trim().escape(),
  body('password').trim().escape(),
  validateInputs,
  registerUser
);

router.post("/login",
  body('username').trim().escape(),
  body('password').trim().escape(),
  loginUser
);

module.exports = router;
