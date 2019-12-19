var express = require("express"); // 引入 express
var app = express(); // 实例化 express，app 有很多方法：get、post、put、delete 等

app.get("/", function(req, res) {
    res.send("Hello World");
});
app.listen(3000, function() {
    console.log("runing at http://localhost:3000");
});
