var fbnq = function(n) {
    if (typeof n !== "number") {
        throw new Error("n should be a Number");
    }
    if (n < 0) {
        throw new Error("n should >= 0");
    }
    if (n > 10) {
        throw new Error("n should <= 10");
    }
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }

    return fbnq(n - 1) + fbnq(n - 2);
};

if (require.main === module) {
    // 如果直接执行 main.js，则会进入此处；如果被其他文件 require，则不会执行
    var n = Number(process.argv[2]);

    console.log(`fibonacci(${n}): ${fbnq(n)}`);
}

module.exports = {
    fbnq
};
