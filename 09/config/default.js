module.exports = {
    port: 3000,
    // express-session config
    session: {
        secret: "zeroNine",
        key: "zeroNine",
        mexAge: 2592000000
    },
    mongodb: "mongodb://localhost:27017/zeroNine"
};
