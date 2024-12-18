"use strict";
// @ts-check

const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");
const bcrypt = require("bcrypt");

// get/check a banking account status
router.route("/:account_number").get(async (request, response) => {
  this.response = response;
  this.request = request;
  this.response.contentType = "application/json";
  this.response.statusCode = Number(parseInt(200));
  this.response.setHeader("Access-Control-Allow-MethodS", "GET");

  try {
    // fetch and check for available account
    const RegisteredAccounts = await pool_connection.query(
      "SELECT * FROM banking_system_db.accounts"
    );
    const FoundAccount = RegisteredAccounts[0].find((account) => {
      return account.account_number === request.params.account_number;
    });


    if (!FoundAccount || typeof FoundAccount === "undefined") {
      this.response
        .status(Number(parseInt(404)))
        .jsonp({
          message: `No such account with account number ${request.params.account_number} was found!`,
        });
    } else {
      this.response.status(Number(parseInt(200))).json({
        message: `Account number ${FoundAccount.account_number} is trusted and safe to be used!`,
        response: {
          id: FoundAccount.id,
          account_number: FoundAccount.account_number,
          surname: FoundAccount.surname,
          givenname: FoundAccount.givenname,
          id_photo: FoundAccount.id_photo,
          account_balance: Number(FoundAccount.account_balance),
          account_debt: Number(FoundAccount.account_debt),
          interest_per_month: 5
        },
      });
    }
  } catch (error) {
    this.response
      .status(Number(parseInt(404)))
      .jsonp({
        message: `No such account with account number ${request.params.account_number} was found!`,
        error: String(error.message)
      });
    console.log(error);
  }
});

router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
