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

<<<<<<< HEAD
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
=======
  const services = {
    message: "Welcome to easy banking system services",
    services: [
      "account balance transfer services",
      "account balance depositing services",
      "account cash withdrawing services",
      "account loan services",
    ]
  }
  
  this.response
    .status(200)
    .jsonp({...services, amount: services.services.length});
>>>>>>> testing_api
});

// route for depositing money(put, get)
router.use(
  "/deposit",
<<<<<<< HEAD
  require("../routers/banking.system.account.deposits")
=======
  require("./routers/banking.system.account.deposits.services")
>>>>>>> testing_api
);
// route for withdrawing money(put, get)
router.use(
  "/withdraw",
<<<<<<< HEAD
  require("../routers/banking.system.account.withdraws")
=======
  require("./routers/banking.system.account.withdraws.services")
>>>>>>> testing_api
);
// route for transferring money(put, get)
router.use(
  "/transfer",
<<<<<<< HEAD
  require("../routers/banking.system.account.transfers")
=======
  require("./routers/banking.system.account.transfers.services")
>>>>>>> testing_api
);
// route for getting a loan
router.use(
  "/loan",
<<<<<<< HEAD
  require("../routers/banking.system.account.loans.handler")
=======
  require("./routers/banking.system.account.loans.services")
>>>>>>> testing_api
);

// 404 error handler for unfounded queries
router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
