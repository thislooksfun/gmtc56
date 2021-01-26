import "./config.js";
import express, { json, Response } from "express";
import session from "express-session";
import pgSimple from "connect-pg-simple";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as bot from "./bot.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import got from "got";
import aw from "./util/async-wrap.js";
import { Auth, authCode } from "./util/discord.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = path.join(__dirname, "../dist/public");

// Add the user object to the session
declare module "express-session" {
  interface SessionData {
    auth?: Auth;
  }
}

function apiRes(res: Response, code: StatusCodes) {
  res.status(code).send({ code, message: getReasonPhrase(code) });
}

const PGStore = pgSimple(session);
app.use(
  session({
    store: new PGStore(),
    secret: process.env.COOKIE_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.use("/public", express.static(publicDir, { index: false }));
app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));

app.get(
  "/auth",
  aw(async (req, res) => {
    const code = req.query.code;
    if (code && typeof code === "string") {
      console.log(`Authenticating with code ${code}`);
      req.session.auth = await authCode(code);
      console.log(
        `Authenticated successfully: ${JSON.stringify(req.session.auth)}`
      );
    }
    res.redirect("/");
  })
);

app.get("/api/next", (req, res) => {
  // TODO:
  // const userid = req.session.user?.id;
  // if (userid) {
  //   bot.next(userid);
  //   apiRes(res, StatusCodes.OK);
  // } else {
  apiRes(res, StatusCodes.FORBIDDEN);
  // }
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Listening on port ${port}`));

(async () => {
  await bot.login(process.env.BOT_TOKEN);

  try {
    await bot.msgOperator("Hello!");
  } catch (e) {
    console.error("Unable to message operator:", e);
    process.exit(1);
  }
})();
