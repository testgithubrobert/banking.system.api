"use strict";
// @ts-check

const express = require("express");
const router = express.Router();
var { v4: uuid } = require("uuid");
const format = require("date-fns").format;
const information = require("../../../model/json/api.information.json");

router.route("/").get((request, response) => {
    this.response = response;
    this.request = request;

    this.response.contentType = "application/json";
    this.response.statusCode = Number(parseInt(200));
    this.response.setHeader("Access-Control-Allow-MethodS", "GET");

    this.response.status(parseInt(200)).jsonp({
        response_id: String(uuid()),
        message: String(information.about_api),
        developer: String(information.developer),
        date: format(new Date(), "dd/MM/yyyy\tHH:mm:ss")
    });
})


router.use(require("../../middleware/error/404.error.middleware.controller"));
module.exports = router;