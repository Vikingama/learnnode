let fs = require('fs');
let readOneFile = file => new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    })
})

readOneFile(process.argv[2]).then(data => {
    const dataStr = data.toString();
    const strArr = dataStr.split("\n");
    console.log(strArr.length - 1);
}).catch(err => new Error(err));