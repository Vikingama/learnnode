var express = require("express");
var utility = require("utility");
var app = express();

app.get("/", function(req, res) {
    // 取出查询参数，如果是 post 请求，查询参数放在 req.body
    var q = req.query.q;
    if (q) {
        var md5q = utility.md5(q);

        res.send(md5q);
    } else {
        res.send("Hello World");
    }
});
app.listen(3000, function() {
    console.log("runing at http://localhost:3000");
});
