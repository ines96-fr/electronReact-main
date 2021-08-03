const { app, BrowserWindow, shell } = require("electron");
const rq = require("electron-require");
const port = 3001;
const gotTheLock = app.requestSingleInstanceLock();
const querystring = require("querystring");
const isDev = require("electron-is-dev");
const { uid } = require("uid");
const server = rq("./server.js");
let mainWindow = null;
const endpoint = uid();

const closeOthersWindows = () => {
	BrowserWindow.getAllWindows().forEach((r) => {
		r.close();
	});
};

const closeAll = () => {
	app.quit();
};

const openLink = (link) => {
	shell.openExternal(`http://localhost:${port}${link}`);
};

function list() {
	return new Promise((resolve, reject) => {
		const win = new BrowserWindow({
			width: 100,
			height: 100,
			center: true,
			show: false,
			webPreferences: {
				contextIsolation: false,
			},
		});
		win.setMenuBarVisibility(false);
		win.loadURL(`http://localhost:${port}/page`);
		win.webContents.on("did-finish-load", () => {
			const list = win.webContents.getPrinters();
			win.close();
			resolve(list);
		});
	});
}

function print(url, printerName, params) {
	return new Promise((resolve, reject) => {
		const win = new BrowserWindow({
			width: 100,
			height: 100,
			center: true,
			show: false,
			webPreferences: {
				contextIsolation: false,
			},
		});
		win.setMenuBarVisibility(false);
		win.loadURL(url);
		win.webContents.on("did-finish-load", () => {
			let deviceName = printerName;
			if (deviceName === null) {
				const list = win.webContents.getPrinters();
				deviceName = list.find((p) => p.isDefault === true);
			}

			win.webContents.print(
				{
					printBackground: true,
					color: false,
					margin: {
						marginType: "printableArea",
					},
					landscape: false,
					pagesPerSheet: 1,
					collate: false,
					copies: 1,
					...params,
					silent: true,
					deviceName,
				},
				(success, failureReason) => {
					win.close();
					if (!success) {
						reject(failureReason);
					} else {
						resolve("ok");
					}
				}
			);
		});
	});
}

app.on("window-all-closed", () => {
	//if (process.platform !== "darwin") app.quit();
});

if (!gotTheLock) {
	app.quit();
} else {
	app.on("second-instance", (event, commandLine, workingDirectory) => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});
	app.on("ready", () => {});
}

server(
	endpoint,
	port,
	isDev,
	closeOthersWindows,
	closeAll,
	openLink,
	print,
	list
).listen(port, () => {
	console.log(`server http://localhost:${port}`);
});
