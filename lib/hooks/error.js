const express = require("express");
const errorHandler = require("@mid/errorHandle"); // 引入错误处理中间件
const app = express();

export default function (app) {
  app.use(errorHandler);
}
