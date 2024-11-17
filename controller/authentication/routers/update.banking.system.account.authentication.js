"use strict";
// @ts-check

const express = require("express");
const router = express.Router();

// update a banking account
router
  .route("/")
  .get((request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(200);
    this.response.setHeader("Access-Control-Allow-MethodS", "GET");

    this.response
      .status(200)
      .jsonp({ message: "Updating banking account at the moment is not allowed!" });
  })
  .put((request, response) => {});

router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
