const electron = require("electron");
const ipc = electron.ipcRenderer;

const button = document.querySelector("button");

button.addEventListener("click", changeWindowToLogin);

function changeWindowToLogin(e) {
  e.preventDefault();
  ipc.send("change-window-login_to_signup", "");
}

const form = document.querySelector("form");

form.addEventListener("submit", loginAuth);

function loginAuth(e) {
  e.preventDefault();

  const username = document.querySelector("#Username").value;
  const password = document.querySelector("#Password").value;

  const user = {
    username: username,
    password: password,
  };

  ipc.send("login-user-auth", user);
}
