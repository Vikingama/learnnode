const express = require("express");
const sha1 = require("sha1");
const UserModel = require("../models/users");
const checkNotLogin = require("../middlewares/check").checkNotLogin;
const router = express.Router();

// GET /signIn
router.get("/", checkNotLogin, function(req, res) {
    res.render("signIn");
});
// POST /signIn
router.post("/", checkNotLogin, function(req, res, next) {
    let name = req.fields.name;
    let password = req.fields.password;

    name = name && name.trim().length !== 0 ? name : "";

    try {
        if (!name.length) {
            throw new Error("请填写用户名");
        } else if (!password.length) {
            throw new Error("请填写密码");
        }
    } catch (error) {
        req.flash("error", error.message);
        return res.redirect("back");
    }

    UserModel.getUserByName(name)
        .then(function(user) {
            if (!user) {
                req.flash("error", "用户不存在");
                return res.redirect("/signUp");
            }
            if (sha1(password) !== user.password) {
                req.flash("error", "用户名或密码错误");
                return res.redirect("back");
            }

            req.flash("success", "登录成功");
            // 用户信息写入 session
            delete user.password;
            req.session.user = user;
            // 跳转到主页
            res.redirect("/posts");
        })
        .catch(next);
});

module.exports = router;
