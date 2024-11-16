"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");
var { v4: uuid } = require("uuid");
const format = require("date-fns").format;

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
      .jsonp({ message: "Welcome to easy banking account loan services!" });
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

      if (!FoundAccount || typeof FoundAccount === "undefined") {
        this.response.status(Number(404)).jsonp({
          message: `No such account with account number ${request.body.account_number} was found!`,
        });
      } else if (FoundAccount.account_balance < Number(20)) {
        this.response
          .status(Number(400))
          .jsonp({
            message: String(
              "insuficient account balance, your account should have an account balance of $20 in order to get a loan"
            ),
          });
      } else if (FoundAccount.account_debt > 0) {
        this.response
          .status(Number(400))
          .jsonp({
            message: String(
              `Account ${FoundAccount.account_number} already has a debt of $${FoundAccount.account_debt}, repay the debt for more loans!`
            ),
          });
      } else {
        // make new loan histroy and save to database
        await pool_connection.query(`
              INSERT INTO banking_system_db.account_loan_history VALUES(
                ${JSON.stringify(uuid())}, ${Number(
          request.body.amount
        )}, ${JSON.stringify(request.body.account_number)}, ${JSON.stringify(
          format(new Date(), "yyyy-MM-dd")
        )}, ${JSON.stringify(format(new Date(), "HH:mm:ss"))}
              )
          `);

        // update the requested account balance and debt amount~
        const NewAccountDebt =
          FoundAccount.account_debt + parseInt(request.body.amount) + 1;
        const NewAccountBalance =
          NewAccountDebt + FoundAccount.account_balance + 1;

        // save changes to database 
        await pool_connection.query(`
              UPDATE banking_system_db.accounts SET account_debt = ${Number(
                NewAccountDebt
              )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        // save changes history to database history
        await pool_connection.query(`
              UPDATE banking_system_db.accounts_history SET account_debt = ${Number(
                NewAccountDebt
              )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        // update account balance after getting account loan
        await pool_connection.query(`
              UPDATE banking_system_db.accounts SET account_balance = ${Number(
                NewAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        // update account balance history after getting account loan
        await pool_connection.query(`
              UPDATE banking_system_db.accounts_history SET account_balance = ${Number(
                NewAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        this.response.status(200).jsonp({
          message: `Account ${FoundAccount.account_number} has been credited with $${request.body.amount} with interest of $${Number(parseInt(1))}`,
          response: {
            id: FoundAccount.id,
            account_number: FoundAccount.account_number,
            new_account_debt: Number(this.request.body.amount + 1),
          }
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
