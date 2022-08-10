const electron = require("electron");
const app = electron.app;
const { BrowserWindow, Notification } = electron;
const ipc = electron.ipcMain;
const path = require("path");
const urlLib = require("url");
const Store = require("electron-store");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const store = new Store();

let win;

// GEt a token.
async function getTokenLogin(username, password) {
  let token;

  var raw = JSON.stringify({
    name: username,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };

  await fetch("http://localhost:3000/users/login", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      token = result.accessToken;
    })
    .catch((err) => console.log(err));

  return token;
}

async function authUserLogin(username, password, token) {
  let userLoggedIn;

  const user = {
    username: username,
    password: password,
    token: token,
  };

  var raw = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.token,
    },
    body: raw,
    redirect: "follow",
  };

  await fetch("http://localhost:3000/authUserLogin", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.detail == "Success") {
        userLoggedIn = true;
      } else {
        userLoggedIn = false;
      }
    })
    .catch((error) => console.log("error", error));

  return userLoggedIn;
}

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
      minHeight: 900,
      minWidth: 1500,
      maxHeight: 1650,
      maxWidth: 2000,
      height: 900,
      width: 1500,
    });

    win.loadURL(
      urlLib.format({
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
      minHeight: 900,
      minWidth: 1500,
      maxHeight: 1650,
      maxWidth: 2000,
      height: 900,
      width: 1500,
    });

    win.loadURL(
      urlLib.format({
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

ipc.on("sign-up-user-data", (e, args) => {
  // Sign up user to database
  const user = {
    username: args.username,
    firstname: args.firstname,
    lastname: args.lastname,
    email: args.email,
    password: args.password,
  };

  console.log(user);
});

ipc.on("change-window-signup_to_login", (e, args) => {
  win.loadURL(
    urlLib.format({
      pathname: path.join(__dirname, "pages/login.html"),
      protocol: "File",
      slashes: true,
    })
  );
});

ipc.on("change-window-login_to_signup", (e, args) => {
  win.loadURL(
    urlLib.format({
      pathname: path.join(__dirname, "pages/signUp.html"),
      protocol: "File",
      slashes: true,
    })
  );
});

ipc.on("login-user-auth", async (e, args) => {
  const user = {
    username: args.username,
    password: args.password,
  };

  let token = await getTokenLogin(user.username, user.password);

  if (token === undefined || token === null) {
    new Notification({
      title: "Could not get Token",
      body: "Please provide proper details",
    }).show();
  }

  if (await authUserLogin(user.username, user.password, token)) {
    win.loadURL(
      urlLib.format({
        pathname: path.join(__dirname, "pages/banking.html"),
        protocol: "File",
        slashes: true,
      })
    );
  } else {
    new Notification({
      title: "Could not Login",
      body: "Please provide proper details",
    });
  }
});

app.on("ready", createMainWindow);

// Mac is bad ngl man
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createMainWindow();
  }
});
