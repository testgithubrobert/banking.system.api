"use strict";
const express = require("express");
const router = express.Router();

router.route("/").get((request, response) => {
  response
    .status(200)
    .jsonp({ message: "Welcome to easy banking accounts handling!" });
});

// middleware to handle banking system accounts
router.use(
  "/registration",
  require("./routers/register.banking.system.account.authentication")
);

router.use(
  "/close",
  require("./routers/drop.banking.system.account.authentication")
);

router.use(
  "/updating",
  require("./routers/update.banking.system.account.authentication")
);

router.use(
  "/",
  require("./routers/get.banking.system.account.authentication")
);

router.use(require("../middleware/error/404.error.middleware.controller"));
module.exports = router;
