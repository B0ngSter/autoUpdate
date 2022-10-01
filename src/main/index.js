import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";

// Quit when all windows are closed.
const exec = require("child_process").exec;

console.log('backend initializing');
const child = exec("cd resources/app/api & node src/index.js", (e, st, std) => {
// const child = exec("cd api & node src/index.js > app.log", (e, st, std) => {
  console.log("e", std);
});
autoUpdater.checkForUpdates();

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Ok'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version is being downloaded.'
	}
	dialog.showMessageBox(dialogOpts, (response) => {

	});
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	};
	dialog.showMessageBox(dialogOpts).then((returnValue) => {
		if (returnValue.response === 0) autoUpdater.quitAndInstall()
	})
});
console.log('backend stated');
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    child.kill();
    app.quit();
  };
  // kill server
});

// Load here all startup windows
require("./mainWindow");

//server
// require("../../api/src/index");
