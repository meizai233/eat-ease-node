const express = require("express");
const db = require("./lib/db.js");
const formidable = require("formidable");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const app = express();

// 在app身上添加属性
app.set("view engine", "ejs");
app.use(express.static("./public"));

//待办 设置session 这是干嘛的
// 待办 可以扩展 session配置
app.use(
  session({
    secret: "suda-key",
    name: "UID",
    cookie: { maxAge: 86400000, httpOnly: true },
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/list", async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = 10;
  const skip = page * limit;

  // 查询数据库
  const docs = await db.find("liuyanban", {}, { limit, skip });
  console.log("docsss", docs);
  const count = await db.getCount("liuyanban", {});
  console.log("counttt", count);

  // render默认在当前目录下的views
  res.render("lyb", {
    datalist: docs,
    count: Math.ceil(count / 10),
  });
});

// 增
app.post("/insert", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      await db.insertMany("liuyanban", [fields]);
      res.json({ status: 200, message: "发表成功" });
    } catch (err) {
      res.json(err);
    }
  });
});

app.get("/delete", async (req, res) => {
  const _id = req.query._id;
  try {
    const result = await db.deleteMany("liuuanban", { _id: ObjectId(_id) });
    res.json({ message: "删除成功", result });
  } catch (err) {
    res.json({ message: "删除失败" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.listen(3000);
