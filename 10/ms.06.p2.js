const fs = require('fs');
const path = require('path');

module.exports = (dir, ext, cb) => {
    fs.readdir(dir, (err, data) => {
        if (err) {
            return cb(err);
        }

        const realExt = `.${ext}`;
        const list = data.filter(item => realExt === path.extname(item));

        return cb(null, list);
    });
}