import flash from "connect-flash";
export default async (app) => {
  app.use(flash());

  // flash中间件？？
  app.use((req, res, next) => {
    //  生存周期 一个请求响应周期内 指定变量到模板
    res.locals.user = req.session.user;
    res.locals.success = req.flash("success").toString();
    res.locals.error = req.flash("error").toString();
    next();
  });
};
