const http = require('http');
const url = require('url');
const app = http.createServer((req, res) => {
    req.setEncoding("utf-8");
    if (req.method === "GET") {
        const temp = url.parse(req.url, true);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(job(temp)));
    } else {
        res.writeHead(405);
        res.end();
    }
});

function job (url) {
    const { pathname, query } = url;
    const { iso } = query;

    switch (pathname) {
        case "/api/parsetime":
            return handleParse(iso);
        case "/api/unixtime":
            return handleUnix(iso);
        default:
            return null;
    }
}
function handleParse (time) {
    const t = new Date(time);
    return {
        hour: t.getHours(),
        minute: t.getMinutes(),
        second: t.getSeconds()
    };
}
function handleUnix (time) {
    const t = new Date(time);
    return {
        unixtime: t.getTime()
    };
}

app.listen(process.argv[2]);