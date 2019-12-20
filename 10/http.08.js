const http = require('http');
let result = "";

http.get(process.argv[2], (res) => {
    res.setEncoding("utf-8");
    res.on('data', data => {
        result = result + data;
    })
    res.on('end', () => {
        console.log(result.length);
        console.log(result);
    })
    res.on('error', (err) => {
        console.error(err);
    })
});