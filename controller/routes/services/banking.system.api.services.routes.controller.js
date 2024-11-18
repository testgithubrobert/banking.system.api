"use strict";
// @ts-check

const express = require("express");
const router = express.Router();

// routes for handling banking system services
router.route("/").get((request, response) => {
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
  "/deposit",
  require("./routers/banking.system.account.deposits.services")
);
// route for withdrawing money(put, get)
router.use(
  "/withdraw",
  require("./routers/banking.system.account.withdraws.services")
);
// route for transferring money(put, get)
router.use(
  "/transfer",
  require("./routers/banking.system.account.transfers.services")
);
// route for getting a loan
router.use(
  "/loan",
  require("./routers/banking.system.account.loans.services")
);

// 404 error handler for unfounded queries
router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
