import "./config.js";
import express, { Response, Router } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import pgSimple from "connect-pg-simple";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as bot from "./bot.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import aw from "./util/async-wrap.js";
import * as discord from "./util/discord.js";
import { AnyObject } from "./util/any-object.js";
import http from "http";
import socket from "./socket.js";
import gform from "./util/gform.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = path.join(__dirname, "../dist/public");

interface AnswerData {
  qNum: number;
  teamNum: number;
  teamName: string;
}

// Add the user object to the session
declare module "express-session" {
  interface SessionData {
    auth?: discord.Auth;
    user?: discord.User;
  }
}

function apiRes(res: Response, code: StatusCodes, data?: AnyObject) {
  res.status(code).send({ code, message: getReasonPhrase(code), data });
}

function apiRouter(): Router {
  const router = express.Router();
  router.use(bodyParser.json());

  router.post(
    "/next",
    aw(async (req, res) => {
      const userid = req.session.user?.id;
      if (!userid) {
        return apiRes(res, StatusCodes.FORBIDDEN);
      }

      await bot.next(userid);
      apiRes(res, StatusCodes.OK);
    })
  );

  router.post(
    "/hangup",
    aw(async (req, res) => {
      const userid = req.session.user?.id;
      if (!userid) {
        return apiRes(res, StatusCodes.FORBIDDEN);
      }

      await bot.hangup(userid);
      apiRes(res, StatusCodes.OK);
    })
  );

  router.post("/logout", (req, res, next) => {
    if (!req.session) {
      return apiRes(res, StatusCodes.OK);
    }

    const id = req.session.user?.id;
    req.session.destroy(e => {
      if (id) socket.close(id);
      if (e) return next(e);
      apiRes(res, StatusCodes.OK);
    });
  });

  router.get("/login-url", (req, res) => {
    apiRes(res, StatusCodes.OK, { url: discord.getLoginUrl() });
  });

  router.get(
    "/me",
    aw(async (req, res) => {
      const token = req.session.auth?.token;
      if (!token) {
        return apiRes(res, StatusCodes.FORBIDDEN);
      }

      const me = await discord.getMe(token);
      return apiRes(res, StatusCodes.OK, {
        name: me.username,
        avatar: discord.getAvatarUrl(me),
      });
    })
  );

  router.post(
    "/record-answer",
    aw(async (req, res) => {
      const user = req.session.user;
      if (!user) {
        return apiRes(res, StatusCodes.FORBIDDEN);
      }

      const { qNum, teamNum, teamName } = req.body as AnswerData;
      const sig = `${user.username}#${user.discriminator} (${user.id})`;
      await gform(qNum, teamNum, teamName, sig);

      apiRes(res, StatusCodes.OK);
    })
  );

  return router;
}

let server: http.Server;
export async function start() {
  const app = express();

  const PGStore = pgSimple(session);
  const sessionParser = session({
    store: new PGStore(),
    secret: process.env.COOKIE_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  });
  app.use(sessionParser);

  app.use("/public", express.static(publicDir, { index: false }));
  app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));

  app.get(
    "/auth",
    aw(async (req, res) => {
      const code = req.query.code;
      if (code && typeof code === "string") {
        console.log(`Authenticating with code ${code}`);
        const { auth, user } = await discord.auth(code);
        req.session.auth = auth;
        req.session.user = user;
        console.log(`Successfully authenticated with code ${code}`);
      }
      res.redirect("/");
    })
  );

  app.use("/api", apiRouter());

  server = http.createServer(app);
  socket.init(server, sessionParser);

  const port = process.env.PORT || 80;

  return new Promise<void>(resolve => {
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
      resolve();
    });
  });
}

export async function stop() {
  return new Promise<void>((res, rej) => {
    if (!server) return res();
    socket.closeServer();
    server.close(e => (e ? rej(e) : res()));
  });
}
