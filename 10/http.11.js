const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    let readStream = fs.createReadStream(process.argv[3], {
        encoding: 'utf-8'
    })
    readStream.on("data", data => {
        res.write(data)
    });
});

server.listen(process.argv[2]);