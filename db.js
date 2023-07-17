// Open a database
// Create objectStore - can only be created,modify in upgradeneeded event
// Make Transactions
let db;
let openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success", (e) => {
  console.log("DB Success");
  db = openRequest.result;
});

openRequest.addEventListener("error", (e) => {
  console.log("DB Error");
});

openRequest.addEventListener("upgradeneeded", (e) => {
  console.log("DB Upgraded and also for initial DB creation");
  db = openRequest.result;

  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("images", { keyPath: "id" });
});
