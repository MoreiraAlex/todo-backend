const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS
};
