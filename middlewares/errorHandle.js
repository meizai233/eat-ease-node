// errorMiddleware.js

// 通常错误处理中间件接受四个参数，第一个参数err是错误对象。
function errorHandler(err, req, res, next) {
  // 判断错误对象是否有状态码，如果没有则设置默认为500
  const statusCode = err.statusCode || 500;
  // 默认错误消息
  const message = err.message || "Internal Server Error";

  // 发送错误响应给客户端
  res.status(statusCode).json({
    error: {
      message: message,
    },
  });
}

module.exports = errorHandler;
