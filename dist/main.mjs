// src/main/error.htm
"use strict";let error_default = "<!DOCTYPE html><head><title>Internal Error</title></head><body><div><p>Graceful Lattice has encountered an error. Detailed information below.</p><pre>${errorTrace}</pre></div></body>\n";

// src/main/handler.mjs
var handler = async function(req, connInfo) {
  let url = new URL(req.url), headers = {};
}, handler_default = handler;

// src/main/index.mjs
var resp200 = JSON.parse('{"status":200,"headers":{"Content-Type":"text/html"}}'), resp405 = JSON.parse('{"status":405,"headers":{"Content-Type":"text/html"}}'), resp500 = JSON.parse('{"status":500,"headers":{"Content-Type":"text/html"}}'), listenObject, listenAddr = Deno.env.get("LISTEN_ADDR"), listenPort = parseInt(Deno.env.get("LISTEN_PORT")), graceJail = parseInt(Deno.env.get("GRACE_JAIL"));
listenObject = JSON.parse(`{"hostname":"0.0.0.0","port":${listenPort || 8e3}}`);
listenAddr && (listenObject.hostname = listenAddr);
listenObject.onListen = function({ hostname, port }) {
  console.info(`Graceful lattice is now listening on http://${hostname}:${port}/`);
};
listenObject.handler = async function(req, connInfo) {
  let clientAddr = connInfo.remoteAddr;
  console.debug(`> ${req.method.toUpperCase().padStart(7, " ")} --- ${clientAddr.hostname}:${clientAddr.port} ${req.url}`);
  let resp;
  try {
    switch (req.method.toLowerCase()) {
      case "get":
      case "head": {
        resp = await handler_default(req, connInfo), resp || (resp = new Response(error_default.replace("${errorTrace}", "The handler did not return any response."), resp200));
        break;
      }
      default:
        resp = new Response(error_default.replace("${errorTrace}", "Unsupported method."), resp405);
    }
  } catch (err) {
    resp = new Response(error_default.replace("${errorTrace}", err.stack.replaceAll(`file://${Deno.cwd()}`, "@app")), resp500), console.error(err.stack);
  }
  return console.debug(`< ${req.method.toUpperCase().padStart(7, " ")} ${resp.status} ${clientAddr.hostname}:${clientAddr.port} ${req.url}`), resp;
};
var webServer = Deno.serve(listenObject);
