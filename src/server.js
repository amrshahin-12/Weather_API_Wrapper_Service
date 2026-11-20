// const dns = require("dns");
// dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, "127.0.0.1", () => {
  console.log("listening...");
});
