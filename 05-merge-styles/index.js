const path = require("path");
const fs = require("fs");

new Promise((resolve, reject) => {
    const arrFiles = [];
    fs.readdir(
        path.join(__dirname, "styles"),
        (err, files) => {
            if (err) throw err.message;
            files.forEach(item => {
                if (path.parse(item).ext === ".css") {
                    arrFiles.push(item);
                }
            })
            resolve(arrFiles);
        }
    )
}).then(fileNames => {
    return new Promise((resolve, reject) => {
        const arrReadFiles = [];
        fileNames.forEach(item => {
            fs.readFile(
                path.join(__dirname, 'styles', item),
                'utf-8',
                (err, data) => {
                    if (err) throw err;
                    arrReadFiles.push(data);
                     if (arrReadFiles.length === fileNames.length) {
                         resolve(arrReadFiles);
                     }
                }
            );
        });
    })
}).then(res=>{
    return new Promise((resolve,reject)=>{
        fs.writeFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            '',
            (err) => {
                if (err) throw err;
                resolve(res);
                console.log('bundle.css');
            }
        );
    })
}).then(res=>{
    res.forEach(item=>{
        fs.appendFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            item,
            err => {
                if (err) throw err;
                console.log(`bundle.css is created`);
            }
        );
    })
})
