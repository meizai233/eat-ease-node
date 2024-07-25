import express from "express";
import db from "./mongodb/db.js";
import { setHooks } from "./lib/utils";
import getConfig from "./lib/hooks/get-config.js";
// 启动项目的hooks
const hooks = ["header", "static", "session", "flash", "log", "routes", "error"];

const app = express();
getConfig(app);

// 获取所有hooks
setHooks(app, hooks);

app.listen(app.config.port);
