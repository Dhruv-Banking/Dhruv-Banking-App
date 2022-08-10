const electron = require("electron");
const ipc = electron.ipcRenderer;

const form = document.querySelector("form");

form.addEventListener("submit", submitData);

function submitData(e) {
  e.preventDefault();

  const username = document.querySelector("#Username").value;
  const firstname = document.querySelector("#Firstname").value;
  const lastname = document.querySelector("#Lastname").value;
  const email = document.querySelector("#Email").value;
  const password = document.querySelector("#Password").value;

  const user = {
    username: username,
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
  };

  ipc.send("sign-up-user-data", user);
}

const button = document.querySelector("button");

button.addEventListener("click", changeWindowToLogin);

function changeWindowToLogin(e) {
  e.preventDefault();
  ipc.send("change-window-signup_to_login", "");
}
