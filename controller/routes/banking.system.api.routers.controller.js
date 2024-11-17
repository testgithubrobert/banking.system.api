"use strict";
// @ts-check

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

// route handler for banking services
router.use("/services", require("./services/banking.system.api.services.routes.controller"));

// route to handle information about api
router.use("/about-api", require("./routers/about.banking.system.api.controller"));

// route to handle guide for the api
router.use("/guide", require("./routers/banking.system.api.guide.controller"));

// 404 error handler for unfounded queries
router.use(require("../middleware/error/404.error.middleware.controller"));
module.exports = router;
