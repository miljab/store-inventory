require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});
