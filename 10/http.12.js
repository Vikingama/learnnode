const http = require('http');
const server = http.createServer((req, res) => {
    req.setEncoding("utf-8");
    let body = '';
    if (req.method === "POST") {
        req.on('data', data => {
            body = body + data.toUpperCase();
        })
        req.on('end', () => {
            res.write(body);
        })
    }
})

server.listen(process.argv[2]);