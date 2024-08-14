/*
    __dirname       获得当前执行文件所在目录的完整目录名
    __filename      获得当前执行文件的带有完整绝对路径的文件名
    process.cwd()   获得当前执行node命令时候的文件夹目录名
*/
const path = require("path");
const express = require("express");
const flash = require("connect-flash");
const winston = require("winston");
const expressWinston = require("express-winston");
const formidable = require("express-formidable");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const config = require("config-lite")(__dirname);
const routes = require("./routes");
const pkg = require("./package");
const app = express();
const port = process.env.PORT || config.port;
// 设置模版路径
app.set("views", path.join(__dirname, "views"));
// 设置模版引擎
app.set("view engine", "ejs");
// 设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));
// session
app.use(
    session({
        // 设置 cookie 中保存 sessionId 的字段名
        name: config.session.key,
        // 通过设置 secret 来计算放在 cookie 中哈希值，实现 signedCookie 防篡改
        secret: config.session.secret,
        // 强制更新 session
        resave: true,
        // 强制创建 session，即使用户未登录
        saveUninitialized: false,
        // 过期时间
        cookie: {
            maxAge: config.session.maxAge
        },
        // 将 session 存储到 mongodb
        store: new MongoStore({
            url: config.mongodb
        })
    })
);
// flash
app.use(flash());
app.use(
    formidable({
        // 上传文件目录
        uploadDir: path.join(__dirname, "public/img"),
        // 保留后缀
        keepExtensions: true
    })
);
// 设置模版全局变量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};
// 添加模版必须的三个变量
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash("success").toString();
    res.locals.error = req.flash("error").toString();
    next();
});
// 正常请求日志
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.File({
                filename: "logs/success.log"
            })
        ]
    })
);
// 设置路由
routes(app);
// 错误请求日志
app.use(
    expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            }),
            new winston.transports.File({
                filename: "logs/error.log"
            })
        ]
    })
);
// 错误显示
app.use(function(err, req, res) {
    console.error(err);
    req.flash("error", err.message);
    res.redirect("/posts");
});
// 设置端口
app.listen(port, function() {
    console.log(`${pkg.name} runing at http://localhost:${port}`);
});
