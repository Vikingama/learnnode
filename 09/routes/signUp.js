const fs = require("fs");
const path = require("path");
const sha1 = require("sha1");
const express = require("express");
const UserModel = require("../models/users");
const checkNotLogin = require("../middlewares/check").checkNotLogin;
const router = express.Router();

// GET /signUp
router.get("/", checkNotLogin, function(req, res) {
    res.render("signUp");
});
// POST /signUp
router.post("/", checkNotLogin, function(req, res, next) {
    let { name, gender, bio, password, repassword } = req.fields;
    let avatar = req.files.avatar.path.split(path.sep).pop();

    name = name && name.trim().length !== 0 ? name : "";
    bio = bio && bio.trim().length !== 0 ? bio : "";

    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error("名字请限制在 1-10 个字符");
        } else if (password.length < 6) {
            throw new Error("密码至少 6 个字符");
        } else if (password !== repassword) {
            throw new Error("两次输入密码不一致");
        } else if (["m", "f", "x"].indexOf(gender) === -1) {
            throw new Error("性别只能是 m、f 或 x");
        } else if (!req.files.avatar.name) {
            throw new Error("缺少头像");
        } else if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error("个人简介请限制在 1-30 个字符");
        }
    } catch (err) {
        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.avatar.path, function(err) {
            if (err) return next(err);
        });
        req.flash("error", err.message);
        return res.redirect("/signUp");
    }
    // sha1 并不安全，实际开发应使用 bcrypt 或 scrypt 加密
    password = sha1(password);
    // 等待写入数据库的用户信息
    let user = {
        name,
        password,
        gender,
        bio,
        avatar
    };
    // 用户信息写入数据库
    UserModel.create(user)
        .then(function(result) {
            // 从数据库获取用户信息
            user = result.ops[0];
            // 从用户信息（不是数据库）中删除敏感信息
            delete user.password;
            // 将用户信息存入 session
            req.session.user = user;
            // 提示注册成功
            req.flash("success", "注册成功");
            // 跳转到首页
            res.redirect("/posts");
        })
        .catch(function(e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path, function(err) {
                if (err) return next(err);
            });
            // 如果用户名被占用，提示用户并跳回注册页面
            if (err.message.match("duplicate key")) {
                req.flash("error", "用户名已被占用");
                return res.redirect("/signUp");
            }

            next(e);
        });
});

module.exports = router;
