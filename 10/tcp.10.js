const net = require("net");
const time = () => {
    let now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    let h = now.getHours();
    let ms = now.getMinutes();
    m = m.toString().length > 1 ? m : `0${m}`;
    d = d.toString().length > 1 ? d : `0${d}`;
    h = h.toString().length > 1 ? h : `0${h}`;
    ms = ms.toString().length > 1 ? ms : `0${ms}`;
    const ymd = `${y}-${m}-${d}`;
    const hms = `${h}:${ms}`;
    return `${ymd} ${hms}\n`;
}
const server = net.createServer(socket => {
    socket.end(time());
});

server.listen(process.argv[2]);