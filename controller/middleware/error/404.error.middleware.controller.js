"use strict";

const FourOFourErrorMiddlewareController = (request, response) => {
  this.request = request;
  this.response = response;
  this.response.statusCode = Number(404);
  this.response.contentType = "application/json";

  this.request
    ? global.setTimeout(() => {
        this.response
          .status(404)
          .jsonp({ message: "ERROR 404: Query Not Found!" });
      }, 2500)
    : "";
};

module.exports = FourOFourErrorMiddlewareController;
