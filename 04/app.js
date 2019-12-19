var eventproxy = require("eventproxy");
var superagent = require("superagent");
var cheerio = require("cheerio");
var url = require("url");
var ep = new eventproxy();
var cnode = "https://cnodejs.org";

superagent.get(cnode).end(function(err, res) {
    if (err) return console.error(err);

    var topicUrls = [];
    var $ = cheerio.load(res.text);

    $("#topic_list .topic_title").each(function(idx, ele) {
        var $ele = $(ele);
        var href = url.resolve(cnode, $ele.attr("href"));

        topicUrls.push(href);
    });

    topicUrls = topicUrls.slice(0, 3);

    // 命令 ep 重复监听 topicUrls.length 次 topic_html 事件之后再运行回调函数
    ep.after("topic_html", topicUrls.length, function(topics) {
        // topics 是个数组，包含了 topicUrls.length 次 ep.emit('topic_html', pair) 中的那 topicUrls.length 个 pair
        topics = topics.map(function(topicPair) {
            var topicUrl = topicPair[0];
            var topicHtml = topicPair[1];
            var $ = cheerio.load(topicHtml);

            return {
                title: $(".topic_full_title")
                    .text()
                    .trim(),
                comment: $(".reply_content")
                    .eq(0)
                    .text()
                    .trim(),
                href: topicUrl
            };
        });
        console.log(topics);
    });

    topicUrls.forEach(function(topicUrl) {
        superagent.get(topicUrl).end(function(err, res) {
            if (err) return console.error(err);

            ep.emit("topic_html", [topicUrl, res.text]);
        });
    });
});
