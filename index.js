require("module-alias/register");
// require 钩子会将自己绑定到节点的 require 并自动动态编译文件。
require("@babel/register");
require("@root/app.js");
