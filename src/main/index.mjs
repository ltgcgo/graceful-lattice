// Lightingale Graceful Lattice

"use strict";

import pageError from "./error.htm";
import reqHandler from "./handler.mjs";

// Global objects
const resp204 = JSON.parse(`{"status":204,"headers":{"Content-Type":"text/html"}}`);
const resp500 = JSON.parse(`{"status":500,"headers":{"Content-Type":"text/html"}}`);

// Load environment variables and arguments
let listenObject;
let listenAddr = Deno.env.get("LISTEN_ADDR");
let listenPort = parseInt(Deno.env.get("LISTEN_PORT"));
let graceJail = parseInt(Deno.env.get("GRACE_JAIL"));

// Configure the listener
listenObject = JSON.parse(`{"hostname":"0.0.0.0","port":${listenPort || 8000}}`);
if (listenAddr) {
	listenObject.hostname = listenAddr;
};
listenObject.onListen = function ({hostname, port}) {
	console.info(`Graceful lattice is now listening on http://${hostname}:${port}/`);
};
listenObject.handler = async function (req, connInfo) {
	let clientAddr = connInfo.remoteAddr;
	console.debug(`> ${req.method.toUpperCase().padStart(7, " ")} --- ${clientAddr.hostname}:${clientAddr.port} ${req.url}`);
	let resp;
	try {
		resp = await reqHandler(req, connInfo);
		if (!resp) {
			resp = new Response(pageError.replace("${errorTrace}", "The handler did not return any response."), resp204);
		};
	} catch (err) {
		resp = new Response(pageError.replace("${errorTrace}", err.stack.replaceAll(Deno.cwd(), "@app")), resp500);
	};
	console.debug(`< ${req.method.toUpperCase().padStart(7, " ")} ${resp.status} ${clientAddr.hostname}:${clientAddr.port} ${req.url}`);
	return resp;
};

// Begin listening
let webServer = Deno.serve(listenObject);
