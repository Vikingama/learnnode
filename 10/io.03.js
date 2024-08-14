let fs = require('fs');

try {
    const data = fs.readFileSync(process.argv[2], 'utf-8');
    const dataStr = data.toString();
    const strArr = dataStr.split("\n");
    console.log(strArr.length - 1);
} catch (err) {
    console.error(err);
}