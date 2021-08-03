const { exec } = require("child_process");
const { uid } = require("uid");
const path = require("path");
const isDev = require("electron-is-dev");
const http = require("http");
const fs = require("fs");
const _ = require("lodash");
const axios = require("axios");
const FormData = require("form-data");

const parsePath = (folder, ...paths) => {
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

//const parsePathOld = (folder, ...paths) => path.join(__dirname, "..", folder, ...paths);

const vendors = (...paths) => parsePath("vendors", ...paths);
const uploads = (...paths) => parsePath("uploads", ...paths);
const signeds = (...paths) => parsePath("signeds", ...paths);

//opensc_pkcs11.dll  shuttlecsp11_3003.dll
const dll = (dllFile = "shuttlecsp11_3003.dll") => `"${vendors(dllFile)}"`;

const jar = (jarFile = "firma.jar") => `"${vendors(jarFile)}"`;

const parseError = (stdout) =>
	stdout.startsWith("ERROR: ")
		? [true, stdout.trim().substring(7)]
		: [false, null];

const list = async (pin) =>
	new Promise((done, fail) => {
		const args = `java -jar ${jar()} listar ${dll()} "${pin}"`;
		//console.log(args);
		exec(args, (error, stdout, stderr) => {
			if (error) fail(error.message);

			if (stderr) fail(stderr);

			const [isError, messageError] = parseError(stdout);

			if (isError) fail(messageError);

			const o = stdout
				.split("|")
				.map((v, i) => ({ id: i, value: v.trim() }));

			done(o);
		});
	});

const downloadFile = (url, file) => {
	return new Promise((done, fail) => {
		const pathFile = fs.createWriteStream(file);
		http.get(url, (response) => {
			if (response.statusCode !== 200)
				return fail(
					new Error(`response status code: ${response.statusCode}`)
				);

			response.pipe(pathFile);
			done(file);
		});
	});
};

const sign = async (pin, alias, urlDownload, payloadRaw = "{}", numberPages) =>
	new Promise(async (done, fail) => {
		const filename = uid();
		const pathFile = uploads(`${filename}.pdf`);
		const output = signeds(`${filename}_signed.pdf`);
		const input = await downloadFile(urlDownload, pathFile);
		let payload = {};

		const args = `java -jar ${jar()} firmar ${dll()} "${pin}" "${alias}" "${input}" "${output}" ${numberPages}`;
		//console.log(args);
		exec(args, async (error, stdout, stderr) => {
			if (error) fail(error.message);

			if (stderr) fail(stderr);

			const [isError, messageError] = parseError(stdout);

			if (isError) fail(messageError);

			try {
				payload = JSON.parse(payloadRaw);
			} catch (err) {
				payload = {};
			}
			//console.log(payload);
			if (payload.url && payload.filekey) {
				//console.log("se envia", payload);

				const form = new FormData();
				form.append(payload.filekey, fs.createReadStream(output));
				const payloadNew = _.omit(payload, ["url", "filekey"]);

				_.forEach(payloadNew, (v, k) => {
					form.append(k, v);
				});

				return axios({
					method: "post",
					url: payload.url,
					data: form,
					headers: form.getHeaders(),
				})
					.then((r) => {
						done({ message: `${filename}_signed.pdf` });
					})
					.catch((err) => {
						fail(err.message);
					});
			} else {
				done({ message: `${filename}_signed.pdf` });
			}
		});
	});

module.exports = {
	list,
	sign,
};
