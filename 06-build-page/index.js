const path = require("path");
const fs = require("fs");

new Promise(resolve=>{
    const arr = [];
    fs.readdir(
        path.join(__dirname,"components"),
        (err, files) => {
            if (err) throw err;
            files.forEach(item => {
                fs.stat(path.join(__dirname,"components", item), 
                (error, stats) => {
                    if (error) throw error;
                    if (stats.isFile()) {
                     arr.push(`{{${path.parse(item).name}}}`)
                    }
                    if(arr.length === files.length){
                        resolve(arr);
                    }
                })
            });
        });
}).then(res=>{
    console.log(res);
    fs.readFile(
        path.join(__dirname,'template.html'),
        'utf-8',
        (err, data) => {
            if (err) throw err;
            let newStr = data;
            res.forEach(item=>{
                newStr = newStr.replace(item,"IVAN");
            })
            // console.log(newStr);
        }   
    );
})





