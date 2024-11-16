"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../model/connection/api.model.connection");

router.route("/").get((request, response) => {
  this.response = response;
  this.request = request;
  this.response.contentType = "application/json";
  this.response.statusCode = Number(200);
  this.response.setHeader("Access-Control-Allow-Method", "GET");

  this.response.status(200).jsonp({ message: "Welcome to easy banking system!" });
});

// route handler for banking system accounts
router.use(
  "/account",
  require("../authentication/banking.system.accounts.authentication")
);

// routes for handling banking system services
router.route("/services").get((request, response) => {
  this.response = response;
  this.request = request;
  this.response.contentType = "application/json";
  this.response.statusCode = Number(200);
  this.response.setHeader("Access-Control-Allow-Method", "GET");

  this.response 
    .status(200)
    .jsonp({
      message: "Welcome to easy banking system services",
      services: [
        "account balance transfer services",
        "account balance depositing services",
        "account cash withdrawing services",
        "account loan services",
      ],
      amount: Number(parseInt(4))
    });
});

// route for depositing money(put, get)
router.use(
  "/services/deposit",
  require("./services/banking.system.account.deposits") 
);
// route for withdrawing money(put, get)
router.use(
  "/services/withdraw",
  require("./services/banking.system.account.withdraws")
);
// route for transferring money(put, get)
router.use(
  "/services/transfer",
  require("./services/banking.system.account.transfers")
);
// route for getting a loan
router.use(
  "/services/loan",
  require("./services/banking.system.account.loans.handler")
);

// serve accounts for banking system
router.route("/api/registered/system/accounts").get(async (request, response) => {
  this.response = response;
  this.request = request;
  this.response.contentType = "application/json";
  this.response.statusCode = Number(parseInt(200));
  this.response.setHeader("Access-Control-Allow-MethodS", "GET");
  
  try {
    // fetch and check for available account
    const RegisteredAccounts = await pool_connection.query("SELECT * FROM banking_system_db.accounts");
    this.response.status(200).jsonp(RegisteredAccounts[Number(parseInt(0))]);
    
  } catch (error) {
    this.response
        .status(Number(parseInt(404)))
        .jsonp({
          message: `No accounts with were found!`,
          error: String(error.message)
        });
      console.log(error);
  }
});

// 404 error handler for unfounded queries
router.use(require("../middleware/error/404.error.middleware.controller"));
module.exports = router;
