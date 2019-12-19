const subModule = require("./ms.06.p2");
const dir = process.argv[2];
const ext = process.argv[3];
let res = (dir, ext) => new Promise((resolve, reject) => {
    const cb = (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    };
    subModule(dir, ext, cb);
});

res(dir, ext).then(list => {
    list.forEach(item => {
        console.log(item)
    });
}).catch(err => {
    console.error(err);
});