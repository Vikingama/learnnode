module.exports = function(app) {
    app.get("/", function(req, res) {
        res.redirect("/posts");
    });
    app.use("/signUp", require("./signUp"));
    app.use("/signIn", require("./signIn"));
    app.use("/signOut", require("./signOut"));
    app.use("/posts", require("./posts"));
    app.use("/comments", require("./comments"));
    app.use(function(req, res) {
        if (!res.headersSent) {
            res.status(404).render("404");
        }
    });
};
