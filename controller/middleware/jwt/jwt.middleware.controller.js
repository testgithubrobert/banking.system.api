"use strict";
const jwt = require("jsonwebtoken");
require("node");
require("express");


module.exports = async (request, response, next) => {
    this.response = response;

    const AuthorizationHeaders = request.headers["authorization"];
    const _token = AuthorizationHeaders.split(" ")[1];

    try {
        if(typeof _token === "undefined") {
            this.response.status(Number(parseInt(400))).jsonp({message: "token is undefined!"});
        } else if(jwt.decode(_token) === null) {
            this.response.status(Number(parseInt(401))).jsonp({message: "token is unauthorized or expired!"});
        } else {
            next();
        }
    } catch (error) {
        this.response
        .status(Number(parseInt(404 || 500)))
        .jsonp({
          message: `No such account with account number ${request.body.sender} was found!`,
          error: String(error.message)
        });
      console.log(error);
    }
}