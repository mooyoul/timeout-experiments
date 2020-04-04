"use strict";

const debug = require("debug");
const dns = require("dns");
const http = require("http");

const log = debug("node-manual-test");
log.enabled = true;

const url = process.env.URL;
const timeout = parseInt(process.env.TIMEOUT, 10) || 1000;

dns.setServers(["127.0.0.1"]);
log("set dns server. requesting");

const req = http.request(url, {
  method: "GET",
});

req
  .setTimeout(timeout)
  .on("socket", (socket) => {
    log("socket assigned");

    socket
      .on("lookup", () => {
        log("socket lookup");
      })
      .on("connect", () => {
        log("socket connected")
      })
      .on("error", (e) => {
        log("socket error: ", e.stack);
      })
      .on("close", () => {
        log("socket closed");
      })
      .on("timeout", () => {
        log("socket timeout");
      });
  })
  .on("error", (e) => {
    log("request error: ", e.stack);
  })
  .on("abort", () => {
    log("request aborted");
  })
  .on("timeout", () => {
    log("request timeout");
  })
  .on("response", (res) => {
    log("got response: ", res.statusCode);

    let recv = 0;
    res
      .on("data", (buf) => {
        recv += buf.length;
      })
      .on("error", (e) => {
        log("response error: ", e.stack);
      })
      .on("abort", () => {
        log("response aborted");
      })
      .on("end", () => {
        log("response ended. received full response");
      });
  })
  .end();
