const fs = require("fs");
const path = require("path");
const ext = `.${process.argv[3]}`;
let readDir = dir => new Promise((resolve, reject) => {
    fs.readdir(dir, (err, list) => {
        if (err) {
            reject(err);
        }
        resolve(list);
    });
});

readDir(process.argv[2]).then(list => {
    list.filter(item => path.extname(item) === ext).forEach(item => {
        console.log(item);
    });
}).catch(err => {
    console.error(err);
})