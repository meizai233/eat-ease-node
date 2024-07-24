import path from "path";

export default {
  port: 3000,
  url: "mongodb+srv://fengwanyan99:123321@suda.am09kdx.mongodb.net/?retryWrites=true&w=majority&appName=suda",
  dbName: "elm_suda",
  session: {
    name: "suda",
    secret: "suda_secret",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: true,
    saveUninitialized: false,
  },
  rootPath: path.join(__dirname, "../"),
};
