const electron = require("electron");
const ipc = electron.ipcRenderer;

const button = document.querySelector("button");

button.addEventListener("click", logOutFunc);

function logOutFunc(e) {
  e.preventDefault();
  ipc.send("log-out-user", "");
}

function getData() {
  ipc.send("get-user-data", "");
}

ipc.on("get-user-data", async (e, args) => {
  let checkings = document.getElementById("checkings");
  let savings = document.getElementById("savings");

  checkings.innerHTML = `$${args.checkings}`;
  savings.innerHTML = `$${args.savings}`;

  // Set window title
  window.document.title = `Welcome back ${args.username} | Dhruv Banking`;
});

getData();

const Transfer_Money_sameAccount = document.querySelector(
  "#DHR__Main-Transfer_Money_sameAccount"
);

Transfer_Money_sameAccount.addEventListener("submit", getTransferData);

function getTransferData() {
  let selectFrom = document.getElementById("transferFrom");
  let valueFrom = selectFrom.options[selectFrom.selectedIndex].value;

  let selectTo = document.getElementById("transferTo");
  let valueTo = selectTo.options[selectTo.selectedIndex].value;

  let amount = document.getElementById("Amount").value;

  const values = [valueFrom, amount, valueTo];

  if (valueFrom === valueTo) {
    alert(
      "Can not send money from from the same account as the account recieving."
    );
  } else if (valueFrom === "Checkings" && valueTo === "Savings") {
    transferMoneyCheckingsToSavings(amount);
  } else if (valueFrom === "Savings" && valueTo === "Checkings") {
    transferMoneySavingToCheckings(amount);
  }
}

function transferMoneyCheckingsToSavings(amount) {
  ipc.send("send-money-checkings-to-savings", amount);

  ipc.on("send-money-checkings-to-savings", async (e, args) => {
    if (args === "true") {
      alert(`Successfully transfered ${amount} from checkings to savings`);
    } else {
      alert("Unknown error.");
    }
  });
}

function transferMoneySavingToCheckings(amount) {
  ipc.send("send-money-savings-to-checkings", amount);

  ipc.on("send-money-savings-to-checkings", async (e, args) => {
    if (args === "true") {
      alert(`Successfully transfered ${amount} from savings to checkings`);
    } else {
      alert("Unknown error.");
    }
  });
}
