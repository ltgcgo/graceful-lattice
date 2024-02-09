// Lightingale Graceful Lattice

"use strict";

import pageError from "./error.htm";
import compressed from "./cenc.json";
import extensions from "./ext.json";
import normalize from "./normalize.mjs";

const resp403 = JSON.parse(`{"status":403,"headers":{"Content-Type":"text/html"}}`);

const indexes = "index.htm,index.html,default.htm,default.html".split(",");

let handler = async function (req, connInfo) {
	let url = new URL(req.url);
	let opt = {
		status: 200,
		headers: {
			"Content-Type": "text/html"
		}
	};
	let body;
	// Normalize path
	let path = normalize(url.pathname);
	// Jail test
	if (connInfo.jail && path.indexOf("/../") == 0) {
		return new Response(pageError.replaceAll("${errorTrace}", "Access denied."), resp403);
	};
	// Serve
	if (path[path.length - 1] == "/") {
		let notFound = true, indexed;
		for (let i = 0; i < indexes.length && notFound; i ++) {
			try {
				let fstat = Deno.stat(`./${path}/${indexes[i]}`);
				indexed = indexes[i];
				notFound = false;
			} catch (err) {};
		};
		if (notFound) {
			// Serve directory
			opt.status = 404;
			body = "Directory listing not enabled.";
		} else {
			// Serve page
			body = (await Deno.open(`./${path}/${indexed}`)).readable;
		};
	} else {
		try {
			let fstat = Deno.stat(`./${path}/${indexes[i]}`);
			// Serve files
			let ext = path.split(".");
			ext = ext[ext.length - 1].toLowerCase();
			opt.headers["Content-Type"] = extensions[ext] || "application/octet-stream";
			body = (await Deno.open(`./${path}`)).readable;
		} catch (err) {};
	};
	return new Response(body, opt);
};

export default handler;
