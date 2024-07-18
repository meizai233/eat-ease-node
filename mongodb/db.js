import mongoose from "mongoose";
import configLite from "config-lite";
// 连接数据库
const config = configLite(__dirname).default;
mongoose.connect(config.url);
// 啥意思
// mongoose.Promise = global.Promise;

const db = mongoose.connection;

// 啥意思
db.once("open", () => {
  console.log("连接数据库成功");
});

export default db;
