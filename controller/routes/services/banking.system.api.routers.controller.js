"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");

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
  require("../../authentication/banking.system.accounts.authentication")
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
  require("../routers/banking.system.account.deposits") 
);
// route for withdrawing money(put, get)
router.use(
  "/services/withdraw",
  require("../routers/banking.system.account.withdraws")
);
// route for transferring money(put, get)
router.use(
  "/services/transfer",
  require("../routers/banking.system.account.transfers")
);
// route for getting a loan
router.use(
  "/services/loan",
  require("../routers/banking.system.account.loans.handler")
);

// 404 error handler for unfounded queries
router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
