import session from "express-session";
import MongoStore from "connect-mongo";

export default function (app) {
  // 将session数据存储在MongoDB中，保持在多个服务器实例之间共享会话状态
  // 创建新的mongo connect用于存储
  app.use(session({ ...app.config.session, store: MongoStore.create({ mongoUrl: app.config.url }) }));
}
