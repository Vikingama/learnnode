// 权限控制
module.exports = {
    checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash("error", "未登录");
            // 没有登录，跳转到登录页面
            return res.redirect("/signIn");
        }
        next();
    },
    checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash("error", "已登录");
            // 返回之前的页面，禁止用户访问登录注册页面
            return res.redirect("back");
        }
        next();
    }
};
