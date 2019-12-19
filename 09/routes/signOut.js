const express = require("express");
const checkLogin = require("../middlewares/check").checkLogin;
const router = express.Router();

// GET /signOut
router.get("/", checkLogin, function(req, res) {
    // 清空 session，提示成功，跳转到首页
    req.session.user = null;
    req.flash("success", "登出成功");
    res.redirect("/posts");
});

module.exports = router;
