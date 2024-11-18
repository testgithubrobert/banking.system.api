"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");
const format = require("date-fns").format;
const bcrypt = require("bcrypt");

// drop a banking account
router
  .route("/")
  .get((request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(parseInt(200));
    this.response.setHeader("Access-Control-Allow-MethodS", "GET");

    this.response
      .status(parseInt(200))
      .jsonp({ message: "Welcome to easy banking account dropping!" });
  })
  .delete(async (request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(parseInt(200));
    this.response.setHeader("Access-Control-Allow-MethodS", "DELETE");

    try {
      // find a requested banking system account for closure
      const RegisteredAccounts = await pool_connection.query(
        "SELECT * FROM banking_system_db.accounts"
      );
      const FoundAccount = RegisteredAccounts[0].find((account) => {
        return account.account_number === request.body.account_number;
      });

      // compare password auth for a requested account
      let PasswordMatch = await bcrypt.compare(
        this.request.body.password,
        FoundAccount.password
      );

      if (!FoundAccount || typeof FoundAccount === "undefined") {
        this.response
          .status(Number(parseInt(404)))
          .jsonp({
            message: `No such account with account number ${request.body.account_number} was found!`,
          });
      } else if (FoundAccount.account_balance > Number(0)) {
        this.response.status(Number(parseInt(400))).jsonp({
          message: String(
            `Account ${FoundAccount.account_number} contains an account balance, withdraw it to continue!`
          ),
        });
      } else if (FoundAccount.account_debt > Number(0)) {
        this.response.status(Number(parseInt(400))).jsonp({
          message: String(
            `Account ${FoundAccount.account_number} already has a debt of $${FoundAccount.account_debt}, repay the debt to continue!`
          ),
        });
      } else if (!PasswordMatch || PasswordMatch === Boolean(false)) {
        this.response.status(Number(parseInt(400))).json(`Password match failed!`);
      } else {
        // delete account from the database
        await pool_connection.query(`
              DELETE FROM banking_system_db.accounts WHERE account_number = ${JSON.stringify(
          FoundAccount.account_number
        )}
          `);

        // save deleted accounts history
        await pool_connection.query(`
          INSERT INTO banking_system_db.deleted_account_history VALUES(
              ${JSON.stringify(FoundAccount.account_number)}, ${JSON.stringify(
          FoundAccount.surname
        )}, ${JSON.stringify(FoundAccount.givenname)}, ${JSON.stringify(
          FoundAccount.email
        )}, ${JSON.stringify(FoundAccount.contact)}, ${JSON.stringify(
          "photo here"
        )}, ${JSON.stringify(format(new Date(), "yyyy-MM-dd"))}
          )`);

        // send response
        this.response.status(parseInt(201)).jsonp({
          response: {
            id: FoundAccount.id,
            account_number: FoundAccount.account_number,
            surname: FoundAccount.surname,
            givenname: FoundAccount.givenname,
            id_photo: FoundAccount.id_photo,
            account_balance: Number(FoundAccount.account_balance),
            account_debt: Number(FoundAccount.account_debt),
            interest_per_month: Number(parseInt(5)),
            status: "body" in this.request ? "closed" : "open",
            date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
          },
          message: `Account ${FoundAccount.account_number} has been closed permanently and it can no longer be used, thank you ${FoundAccount.surname} ${FoundAccount.givenname} for moving with use!`,
        });
      }
    } catch (error) {
      this.response
        .status(Number(parseInt(404)))
        .jsonp({
          message: `No such account with account number ${request.body.sender} was found!`,
          error: String(error.message)
        });
      console.log(error);
    }
  });

router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
