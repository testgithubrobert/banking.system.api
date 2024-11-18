"use strict";
// @ts-check

const mysql2 = require("mysql2");
// configure dotenv for secrete tokens and password
require("dotenv").config();
require("dotenv").configDotenv();

// apply configurations for db successful db connections
const pool_connection = mysql2.createPool({
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
});

// get pool connection from the database
pool_connection.getConnection((error, connection) => {
  error
    ? console.log(String(error))
    : console.log(String("connection to db succeeded!"));
});

module.exports = pool_connection.promise();