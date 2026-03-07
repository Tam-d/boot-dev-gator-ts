import { setUser, readConfig } from "./config.js";

function main() {

  setUser("Tam");

  console.log(readConfig());
}

main();