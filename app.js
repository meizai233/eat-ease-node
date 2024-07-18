import express from "express";
import db from "./mongodb/db.js";
import configLite from "config-lite";
import router from "./routes/index.js";

const app = express();

app.use(express.static("./public"));
const config = configLite(__dirname).default;

router(app);

app.listen(config.port);
