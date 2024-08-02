import mongoose from "mongoose";
import configLite from "config-lite";
// 连接数据库
const config = configLite(__dirname).default;
mongoose.connect(config.url, { dbName: config.dbName });
// 啥意思
// mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.once("open", () => {
  console.log("连接数据库成功");
});

db.on("error", function (error) {
  console.error("Error in MongoDb connection: " + error);
  mongoose.disconnect();
});

db.on("close", function () {
  console.log("数据库断开，重新连接数据库");
  mongoose.connect(config.url, { server: { auto_reconnect: true } });
});

// 在 Node.js 进程退出时关闭连接
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB Atlas disconnected through app termination");
    process.exit(0);
  });
});

export default db;
