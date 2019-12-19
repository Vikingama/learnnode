/*
    当需要去多个源（<=10）汇总数据时，用 eventproxy 方便；
    当需要用到队列、需要控制并发数时，用 async 方便。
*/
var async = require("async");
var fetchUrl = (function() {
    var currentCount = 0;

    return function(url, callback) {
        var delay = parseInt((Math.random() * 10000000) % 2000, 10);

        currentCount++;

        console.log(
            `现在的并发数是：${currentCount}，正在抓取的是：${url}，耗时${delay}毫秒`
        );

        setTimeout(function() {
            currentCount--;
            callback(null, `${url} html content`);
        }, delay);
    };
})();
var urls = [];

for (var i = 0; i < 30; i++) {
    urls.push(`https://www.datasource${i}.com`);
}

async.mapLimit(
    urls,
    5,
    function(url, callback) {
        fetchUrl(url, callback);
    },
    function(err, res) {
        if (err) return console.error(error);
        console.log(res);
    }
);
