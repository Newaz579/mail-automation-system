
const mysql = require("mysql2");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

console.log("Attempting DB connection with the following details:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  } else {
    console.log("Database connected successfully.");
  }
});

db.query = promisify(db.query).bind(db); 

module.exports = db;
