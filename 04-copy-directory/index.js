const path = require("path");
const fs = require("fs");
const {
    resolve
} = require("path");

new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, 'files-copy'), {
            recursive: true
        },
        err => {
            if (err) throw err;
            console.log("folder 'files-copy' was created");
            resolve();
        });
}).then(() => {
    return new Promise((resolve, reject) => {
        fs.readdir(
            path.join(__dirname, 'files-copy'),
            (err, files) => {
                if (err) throw err;
                files.forEach(item => {
                    fs.unlink(path.join(__dirname, "files-copy", item), (err) => {
                        if (err) throw err;
                    });
                });
                resolve();
            });
    });
}).then(() => {
    fs.readdir(
        path.join(__dirname, 'files'),
        (err, files) => {
            if (err) throw err;
            files.forEach(item => {
                fs.copyFile(
                    path.join(__dirname, "files", item),
                    path.join(__dirname, "files-copy", item),
                    err => {
                        if (err) throw err;
                        console.log(`file "${item}"  was copied`);
                    }
                );
            });
        });
})
