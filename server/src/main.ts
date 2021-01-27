import "./config.js";
import * as server from "./server.js";
import * as bot from "./bot.js";

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down...");
  await server.stop();
  bot.close();
  console.log("Shutdown successful, goodbye!");
  process.exit(0);
});

(async () => {
  await bot.login(process.env.BOT_TOKEN);
  await server.start();
})();
