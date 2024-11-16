"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");
var { v4: uuid } = require("uuid");
const format = require("date-fns").format;
const bcrypt = require("bcrypt");

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
      .jsonp({ message: "Welcome to easy banking account transfer services!" });
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

      const FoundSenderAccount = RegisteredAccounts[0].find((account) => {
        return account.account_number === this.request.body.sender;
      });
      
      const FoundReceiverAccount = RegisteredAccounts[0].find((account) => {
        return account.account_number === this.request.body.receiver;
      });

      // compare password auth for a requested account
      let PasswordMatch = await bcrypt.compare(
        this.request.body.password,
        FoundSenderAccount.password
      );

      if (!FoundSenderAccount || typeof FoundSenderAccount === "undefined") {
        this.response
          .status(Number(404))
          .jsonp({
            message: `No such account with account number ${request.body.sender} was found!`,
          });
      } else if (
        !FoundReceiverAccount ||
        typeof FoundReceiverAccount === "undefined"
      ) {
        this.response
          .status(Number(404))
          .jsonp({
            message: `No such account with account number ${request.body.receiver} was found!`,
          });
      } else if (
        ("body" in this.request &&
          typeof this.request.body.sender === "undefined") ||
        typeof this.request.body.receiver === "undefined" ||
        typeof this.request.body.password === "undefined" ||
        typeof this.request.body.amount === "undefined"
      ) {
        this.response.status(400).jsonp({
          message:
            "Please check your refill form, something might be undefined!",
        });
      } else if (this.request.body.amount < 10) {
        this.response
          .status(Number(400))
          .jsonp({
            message: String(
              "amount of transfer is insufficient, it should be greater than $10!"
            ),
          });
      } else if (!PasswordMatch || PasswordMatch === Boolean(false)) {
        this.response.status(Number(400)).json(`Password match failed!`);
      } else if (FoundSenderAccount.account_debt > 0) {
        this.response.status(Number(400)).jsonp({
          message: String(
            `Account ${FoundSenderAccount.account_number} already has a debt of $${FoundSenderAccount.account_debt}, repay the debt to continue with transfer!`
          ),
        });
      } else if(FoundSenderAccount.account_balance < Number(parseInt(20))) {
        this.response.status(Number(400)).jsonp({
          message: String(
            `Account ${FoundSenderAccount.account_number} has less account balance to finish transfer, recharge to continue!`
          ),
        });
      } else {
        // update both account(sender account and receiver account)
        var NewSenderAccountBalance =
          FoundSenderAccount.account_balance -
          parseInt(this.request.body.amount) - 1;
        var NewReceiverAccountBalance =
          FoundReceiverAccount.account_balance +
          parseInt(this.request.body.amount);

        // save changes to the databases
        await pool_connection.query(`
              UPDATE banking_system_db.accounts SET account_balance = ${Number(
                NewSenderAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundSenderAccount.account_number
        )}
          `);

        // save changes to the databases for history
        await pool_connection.query(`
              UPDATE banking_system_db.accounts_history SET account_balance = ${Number(
                NewSenderAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundSenderAccount.account_number
        )}
          `);

        // save changes to the databases
        await pool_connection.query(`
              UPDATE banking_system_db.accounts SET account_balance = ${Number(
                NewReceiverAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundReceiverAccount.account_number
        )}
          `);

        //  save changes to the databases for history
        await pool_connection.query(`
              UPDATE banking_system_db.accounts_history SET account_balance = ${Number(
                NewReceiverAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundReceiverAccount.account_number
        )}
          `);

          // save history for transfers to db
            await pool_connection.query(`
              INSERT INTO banking_system_db.account_transfers_history VALUES(
                ${JSON.stringify(uuid())}, ${JSON.stringify(FoundSenderAccount.account_number)}, ${JSON.stringify(FoundReceiverAccount.account_number)}, ${Number(parseInt(this.request.body.amount))}, ${JSON.stringify(
                  format(new Date(), "yyyy-MM-dd")
                )}, ${JSON.stringify(format(new Date(), "HH:mm:ss"))}
              )
          `);

        // send response
        this.response
          .status(201)
          .jsonp({
            response: {
              sender: FoundSenderAccount.account_number,
              receiver: FoundReceiverAccount.account_number,
              charge: "$" + 1,
              amount: `$${this.request.body.amount}`
            },
            message: `Transfer from ${FoundSenderAccount.account_number} to ${FoundReceiverAccount.account_number} of $${this.request.body.amount} has been successfully done!`,
          });
      }
    } catch (error) {
      this.response.status(Number(404)).jsonp({
        message: `No such account with account number ${request.body.sender} was found!`,
      });
      console.log(error);
    }
  });

router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
