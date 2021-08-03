//const rq = require("electron-require");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const bodyParser = require("body-parser");
const path = require("path");
const jsTemplate = _.template(`

document.addEventListener(
	"DOMContentLoaded",
	function () {
		var elements = document.getElementsByClassName("to-sign");
		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener(
				"click",
				function (e) {
					firmarEvent(e.target);
				},
				false
			);
		}
	},
	false
);

function firmar(origen, payload) {
	var p = payload.url && payload.filekey ? payload : {};
	var body = document.getElementsByTagName("body")[0];
	var url =
		"http://localhost:<%= port %>/<%= endpoint %>?origen=" +
		origen +
		"&payload=" +
		JSON.stringify(p);
	var tag = document.createElement("script");
	tag.src = url;
	tag.crossorigin = "anonymous";
	body.appendChild(tag);

	return true;
}

function firmarEvent(e) {
	var payload = {};
	var origen = "";
	for (var att, i = 0, atts = e.attributes, n = atts.length; i < n; i++) {
		att = atts[i];

		if (att.nodeName.substring(0, 5) === "data-") {
			var name = att.nodeName.substring(5);
			var value = att.nodeValue;
			if (name === "origen") origen = value;
			else {
				payload[name] = value;
			}
		}
	}
	firmar(origen, payload);
}

`);

const parsePath = (isDev, folder, ...paths) => {
	if (isDev)
		return path.join(
			path.dirname(__dirname),
			"extraResources",
			folder,
			...paths
		);
	return path.join(
		path.dirname(__dirname),
		"..",
		"extraResources",
		folder,
		...paths
	);
};

module.exports = (
	endpoint,
	port,
	isDev,
	closeOthersWindows,
	closeAll,
	openLink,
	print,
	list
) => {
	const server = express();
	server.use(bodyParser.urlencoded({ extended: false }));
	server.use(bodyParser.json());
	server.use(cors());
	server.set("trust proxy", true);

	server.get("/print/:printerName?", async (req, res, next) => {
		try {
			if (!req.query.url) throw new Error("url required");
			//const ip = req.headers["x-forwarded-for"] || req.remoteAddress;
			const url = req.query.url;
			const printerName = req.params.printerName || null;
			const printStatus = await print(url, printerName, req.query);
			res.json({
				message: printStatus,
			});
		} catch (err) {
			next(err);
		}
	});

	server.get("/list", async (req, res, next) => {
		try {
			const printers = await list();
			res.json(printers);
		} catch (err) {
			next(err);
		}
	});

	server.get("/close", (req, res) => {
		closeOthersWindows();
		res.status(202).send("ok");
	});

	server.get("/closeAll", (req, res) => {
		closeAll();
		res.status(202).send("ok");
	});

	server.get("/page", (req, res, next) => {
		res.send("page test");
	});

	server.get("/js", (req, res, next) => {
		res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
		res.write(jsTemplate({ port, endpoint }));
		res.end("");
	});

	/*server.get("/" + endpoint, async (req, res, next) => {
		try {
			if (!req.query.origen)
				throw new Error("El campo origen es requerido.");
			const [error, numberPages] = await getNumberPages(req.query.origen);
			mainWindow({
				...req.query,
				numberPages,
				error: error ? 1 : 0,
			});
			res.status(202).send("ok");
		} catch (err) {
			next(err);
		}
	});*/

	server.use(async (err, req, res, next) => {
		console.log(err);
		res.status(500);
		res.send({ error: err });
	});

	return server;
};
