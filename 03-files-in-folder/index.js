const fs = require("fs");
const path = require("path");

const arr = [];

fs.readdir(
    path.join(__dirname, "secret-folder"),
    (err, files) => {
        if (err) throw err;
        files.forEach(item => {
            fs.stat(path.join(__dirname, "secret-folder", item), 
            (error, stats) => {
                if (error) throw error;
                if (stats.isFile()) {
                    let {name,ext} = path.parse(item);
                    let extDelDot = ext.slice(1,ext.length);
                    let size = (stats.size/1024).toFixed(3);
                    console.log(`
                        ${name} - ${extDelDot} - ${size}kb
                    `);
                }
            })
        });
    });





