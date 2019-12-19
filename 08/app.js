var express = require("express");
var app = express();
var fibonacci = function(n) {
    if (typeof n !== "number" || isNaN(n)) {
        throw new Error("n should be a Number");
    }
    if (n < 0) {
        throw new Error("n should >= 0");
    }
    if (n > 10) {
        throw new Error("n should <= 10");
    }
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
};

app.get("/fib", function(req, res) {
    // http 传来的东西默认都是 String
    var n = Number(req.query.n);

    try {
        // 如果直接给个数字给 res.send 的话，会当成是一个 http 状态码，所以明确给 String
        res.send(String(fibonacci(n)));
    } catch (err) {
        // 如果 fibonacci 抛错的话，错误信息会记录在 err 对象的 message 属性中
        res.status(500).send(err.message);
    }
});
app.listen(3000, function() {
    console.log("runing at http://localhost:3000");
});

module.exports = app;
