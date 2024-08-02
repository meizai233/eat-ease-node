import routes from "@routes/index.js";

export default function (app) {
  // 导入所有路由
  app.get("/", (req, res, next) => {
    res.redirect("/home");
  });
  Object.keys(routes).forEach((key) => {
    app.use(`/${key}`, routes[key]);
  });
  // 路由兜底
  app.use((err, req, res, next) => {
    console.log("router err", err);
    res.send("未找到当前路由");
  });
}
