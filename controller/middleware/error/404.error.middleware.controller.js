"use strict";

const FourOFourErrorMiddlewareController = (request, response) => {
  this.request = request;
  this.response = response;
  this.response.statusCode = Number(parseInt(404));
  this.response.contentType = "application/json";

  this.request
    ? global.setTimeout(() => {
      this.response
        .status(404)
        .jsonp({ message: "ERROR 404: Query Not Found!" });
    }, Number(parseInt(3000)))
    : "";
};

module.exports = FourOFourErrorMiddlewareController;
