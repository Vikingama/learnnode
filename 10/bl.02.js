let paramsArr = process.argv.slice(2);
let result = 0;

paramsArr.forEach(item => {
    const i = item - 0;
    if (typeof i === "number") {
        result += i;
    }
})

console.log(result);