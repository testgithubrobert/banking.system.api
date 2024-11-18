"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");
var { v4: uuid } = require("uuid");
const format = require("date-fns").format;
const bcrypt = require("bcrypt");

// make a banking system account balance withdraw
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
      .jsonp({ message: "Welcome to easy banking account withdraw services!" });
  })
  .post(async (request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(200);
    this.response.setHeader("Access-Control-Allow-MethodS", "POST");

    try {
      // find a requested banking system account for withdraw
      const RegisteredAccounts = await pool_connection.query(
        "SELECT * FROM banking_system_db.accounts"
      );

      const FoundAccount = RegisteredAccounts[0].find((account) => {
        return account.account_number === request.body.account_number;
      });

      // compare password auth for a requested account
      let PasswordMatch = await bcrypt.compare(
        request.body.password,
        FoundAccount.password
      );

      if (!FoundAccount || typeof FoundAccount === "undefined") {
        this.response.status(Number(404)).jsonp({
          message: `No such account with account number ${request.body.account_number} was found!`,
        });
      } else if (FoundAccount.account_balance < request.body.amount) {
        this.response
          .status(Number(400))
          .jsonp({ message: String("insuficient account balance!") });
      } else if (!PasswordMatch || PasswordMatch === Boolean(false)) {
        this.response.status(Number(400)).json(`Password match failed!`);
      } else if (FoundAccount.account_balance < Number(parseInt(20))) {
        this.response.status(Number(400)).jsonp({
          message: String(
            `Account ${FoundAccount.account_number} has less account balance to finish withdraw, recharge to continue!`
          ),
        });
      } else {
        // make new widthdraw histroy
        await pool_connection.query(`
              INSERT INTO banking_system_db.account_withdraw_history VALUES(
                ${JSON.stringify(uuid())}, ${Number(
          request.body.amount
        )}, ${JSON.stringify(request.body.account_number)}, ${JSON.stringify(
          format(new Date(), "yyyy-MM-dd")
        )}, ${JSON.stringify(format(new Date(), "HH:mm:ss"))}
              )
          `);

        // update the requested account for withdrawing
        const NewAccountBalance =
          FoundAccount.account_balance - parseInt(request.body.amount);
        await pool_connection.query(`
              UPDATE banking_system_db.accounts SET account_balance = ${Number(
          NewAccountBalance
        )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        this.response
          .status(200)
          .jsonp({
            message: `Withdrew $${request.body.amount} from account with account number ${FoundAccount.account_number}`,
          });
      }
    } catch (error) {
      this.response.status(Number(404)).jsonp({
        message: `No such account with account number ${request.body.account_number} was found!`,
      });
      console.log(error);
    }
  });

router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
