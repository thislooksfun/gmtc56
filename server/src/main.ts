import "./config.js";
import * as server from "./server.js";
import * as bot from "./bot.js";

(async () => {
  await bot.login(process.env.BOT_TOKEN);
  await server.start();
})();
