const electron = require("electron");
const app = electron.app;
const { BrowserWindow } = electron;
const path = require("path");
const url = require("url");
const Store = require("electron-store");

const store = new Store();

let win;

function firstTimeUser() {
  const username = store.get("username");

  if (username === undefined || username === null) {
    return false;
  } else {
    return true;
  }
}

function createMainWindow() {
  if (firstTimeUser() === true) {
    win = new BrowserWindow({
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
      },
    });

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "pages/login.html"),
        protocol: "File",
        slashes: true,
      })
    );

    win.on("closed", () => {
      win = null;
    });
  } else if (firstTimeUser() === false) {
    win = new BrowserWindow({
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
      },
    });

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "pages/signUp.html"),
        protocol: "File",
        slashes: true,
      })
    );

    win.on("closed", () => {
      win = null;
    });
  }
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit;
  }
});

app.on("activate", () => {
  if (win === null) {
    createMainWindow();
  }
});
