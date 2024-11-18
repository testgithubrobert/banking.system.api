"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../../model/connection/api.model.connection");
var { v4: uuid } = require("uuid");
const format = require("date-fns").format;
const bcrypt = require("bcrypt");

// random account number
const a = Math.floor(Math.random() * 100);
const b = Math.floor(Math.random() * 200);
const c = Math.floor(Math.random() * 300);
const d = Math.floor(Math.random() * 400);

const random_number = `R${a}${b}${c}${d}AN`;

// make or register a banking account
router
  .route("/")
  .get(async (request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(200);

    this.response
      .status(200)
      .jsonp({ message: "Welcome to easy banking account registering!" });
  })
  .post(async (request, response) => {
    this.response = response;
    this.request = request;
    this.response.contentType = "application/json";
    this.response.statusCode = Number(200);

    try {
      // check for available or duplicate accounts that use same email
      const RegisteredAccounts = await pool_connection.query(
        "SELECT * FROM banking_system_db.accounts"
      );

      const FoundAccountEmail = RegisteredAccounts[0].filter((account) => {
        return account.email === request.body.email;
      });

      const FoundAccountContact = RegisteredAccounts[0].filter((account) => {
        return account.contact === request.body.contact;
      });

      if (FoundAccountEmail.length > 0 || FoundAccountContact.length > 0) {
        this.response
          .status(400)
          .jsonp({ message: "Account email or contact is already in use!" });
      } else if (
        typeof this.request.body.surname === "undefined" ||
        typeof this.request.body.givenname === "undefined" ||
        typeof this.request.body.email === "undefined" ||
        typeof this.request.body.contact === "undefined" ||
        typeof this.request.body.password === "undefined"
      ) {
        this.response.status(400).jsonp({
          message:
            "Please check your refill form, something might be undefined!",
        });
      } else {
        // hash and encrypt client account passwords before saved to db;
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(request.body.password, salt);
        // encrypt password
        const encode = btoa(hash);

        await pool_connection.query(`
            INSERT INTO banking_system_db.accounts VALUES(
                ${JSON.stringify(random_number)}, ${JSON.stringify(
          request.body.surname
        )}, ${JSON.stringify(request.body.givenname)}, ${JSON.stringify(
          request.body.email
        )}, ${JSON.stringify(request.body.contact)}, ${JSON.stringify(
          "photo here"
        )}, ${Number(0)}, ${Number(0)}, ${JSON.stringify(
          format(new Date(), "yyyy-MM-dd")
        )}, ${JSON.stringify(encode)}, ${JSON.stringify(uuid())}
            )`);

        // provide accounts history for easy tracking
        await pool_connection.query(`
            INSERT INTO banking_system_db.accounts_history VALUES(
                ${JSON.stringify(random_number)}, ${JSON.stringify(
          request.body.surname
        )}, ${JSON.stringify(request.body.givenname)}, ${JSON.stringify(
          request.body.email
        )}, ${JSON.stringify(request.body.contact)}, ${JSON.stringify(
          "photo here"
        )}, ${Number(0)}, ${Number(0)}, ${JSON.stringify(
          format(new Date(), "yyyy-MM-dd")
        )}
            )`);

        this.response.status(201).jsonp({
          message:
            "successfully account has been registered, you can now start depositing or withdrawing cash on your account!",
        });
      }
    } catch (error) {
      this.response.status(Number(parseInt(500))).jsonp({ ERROR: error.message });
      console.log(error);
    }
  });

router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;
