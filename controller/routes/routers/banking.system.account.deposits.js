"use strict";
// @ts-check

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
    this.response.statusCode = Number(parseInt(200));
    this.response.setHeader("Access-Control-Allow-MethodS", "GET");

    this.response.status(parseInt(200)).jsonp({
      message: "Welcome to easy banking account depositing services!",
    });
  })
  .post(async (request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(parseInt(200));
    this.response.setHeader("Access-Control-Allow-MethodS", "POST");

    try {
      // find a requested banking system account for deposit
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
      } else if (request.body.amount < 10) {
        this.response
          .status(Number(400))
          .jsonp({ message: String("amount of deposit is insufficient!") });
      } else if (
        FoundAccount.account_balance >= Number(50) &&
        FoundAccount.account_debt > Number(0) &&
        parseInt(request.body.amount) > FoundAccount.account_debt
      ) {
        // make new deposits history to database
        await pool_connection.query(`
                INSERT INTO banking_system_db.account_deposits_history VALUES(
                  ${JSON.stringify(uuid())}, ${Number(
          request.body.amount
        )}, ${JSON.stringify(request.body.account_number)}, ${JSON.stringify(
          format(new Date(), "yyyy-MM-dd")
        )}, ${JSON.stringify(format(new Date(), "HH:mm:ss"))}
                )`);

        // add new account balance and save to db
        const NewAccountBalance =
          parseInt(request.body.amount) -
          parseInt(FoundAccount.account_debt) +
          FoundAccount.account_balance;

        // set new account balance
        await pool_connection.query(`
                  UPDATE banking_system_db.accounts SET account_balance = ${Number(
                    NewAccountBalance
                  )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
              `);

        // set new account balance history
        await pool_connection.query(`
                  UPDATE banking_system_db.accounts SET account_balance = ${Number(
                    NewAccountBalance
                  )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
              `);

        // set account debt = 0 after deduction from deposited amount
        await pool_connection.query(`
                  UPDATE banking_system_db.accounts SET account_debt = 0 WHERE account_number = ${JSON.stringify(
                    FoundAccount.account_number
                  )}
              `);

        // set account history debt = 0 after deduction from deposited amount
        await pool_connection.query(`
                  UPDATE banking_system_db.accounts_history SET account_debt = 0 WHERE account_number = ${JSON.stringify(
                    FoundAccount.account_number
                  )}
              `);

        this.response.status(parseInt(200)).jsonp({
          message: `deposited $${request.body.amount - FoundAccount.account_debt} and paid a debt of $${FoundAccount.account_debt} on account with account number ${FoundAccount.account_number}`,
        });

      } else {
        // make new deposits history to database
        await pool_connection.query(`
              INSERT INTO banking_system_db.account_deposits_history VALUES(
                ${JSON.stringify(uuid())}, ${Number(
          request.body.amount
        )}, ${JSON.stringify(request.body.account_number)}, ${JSON.stringify(
          format(new Date(), "yyyy-MM-dd")
        )}, ${JSON.stringify(format(new Date(), "HH:mm:ss"))}
              )
          `);

        // update the requested account for deposit
        const NewAccountBalance =
          parseInt(request.body.amount) + FoundAccount.account_balance;
        await pool_connection.query(`
              UPDATE banking_system_db.accounts SET account_balance = ${Number(
                NewAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        // update the requested account history for deposit
        await pool_connection.query(`
              UPDATE banking_system_db.accounts_history SET account_balance = ${Number(
                NewAccountBalance
              )} WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        this.response.status(parseInt(200)).jsonp({
          message: `deposited $${request.body.amount} on account with account number ${FoundAccount.account_number}`,
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
