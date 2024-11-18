"use strict";
const express = module.require("express");
const http = module.require("node:http");
const api = express();
const server = http.createServer(api);
const cors = require("cors");

// disallow fetching or accessing of unauthorized resources on this api
api.use(cors({ origin: ["*"], credentials: Boolean(true) }));

// configure api routing middleware for handling api
api.use((request, response, next) => {
  this.request = request;
  this.response = response;

  this.response.statusCode = Number(200);
  this.response.contentType = this.request ? "application/json" : "text/plain";
  this.response.setHeader(
    "Access-Control-Allow-Method",
    "PUT, PATCH, DELETE, POST, GET"
  ); // allow all http/https methods
  this.response.setHeader("Access-Control-Allow-Credentials", Boolean(true));
  this.response.setHeader("Access-Control-Allow-Origin", "*");

  this.request
    ? next()
    : this.response
      .status(200)
      .jsonp({ message: "Failed to go to next middleware!" });
});

api.use(express.json());
api.use(express.urlencoded({ extended: Boolean(true) }));
api.use(module.require("body-parser").json());
api.use(module.require("body-parser").urlencoded({ extended: Boolean(true) }));

// api routers handlers
api.use("/", require("../routers/banking.system.api.routers.controller"));

// set api configurations
api.set("port", process.env.PORT || 4000);
api.set("host", process.env.HOST || "localhost");

const events = module.require("node:events");
const ee = new events();
ee.on("start", () => console.log(String("api server started!")));

// 404 middleware for handling unfounded queries
api.use(module.require("../middleware/error/404.error.middleware.controller"));

// start or run server on localhost
server.listen(api.get("port"), api.get("host"), () => {
  server.listening
    ? ee.emit("start")
    : console.log(String("api server not running!"));
});
