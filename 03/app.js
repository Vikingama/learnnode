var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var app = express();

app.get("/", function(req, res, next) {
    var html = "https://cnodejs.org/";

    superagent.get(html).end(function(err, saRes) {
        if (err) return next(err);
        // saRes.text 里存储着页面内容
        var $ = cheerio.load(saRes.text);
        var items = [];

        $("#topic_list .topic_title").each(function(idx, ele) {
            var $ele = $(ele);
            var href = $ele.attr("href").replace("/topic", "topic");

            items.push({
                title: $ele.attr("title"),
                href: `${html}${href}`
            });
        });

        res.send(items);
    });
});
app.listen(3000, function() {
    console.log("runing at http://localhost:3000");
});
