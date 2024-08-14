const http = require('http');
const getUrl = url => new Promise((resolve, reject) => {
    let answer = "";
    http.get(url, res => {
        res.setEncoding('utf-8');
        res.on('data', data => {
            answer = answer + data;
        })
        res.on('end', () => {
            resolve(answer);
        })
        res.on('error', (err) => {
            reject(err);
        })
    })
})

Promise.all([getUrl(process.argv[2]), getUrl(process.argv[3]), getUrl(process.argv[4])]).then(res => {
    res.forEach(item => {
        console.log(item);
    });
}).catch(err => {
    console.log(err)
});