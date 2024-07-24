export default function (app) {
  // 设置头部
  app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    // 待办 如果不这样处理 就不能快速返回吗
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else next();
  });
}
