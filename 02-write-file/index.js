const fs = require("fs");
const path = require("path");
const {stdin,stdout,stderr} = process;

fs.writeFile(
    path.join(__dirname,'notes.txt'),
    '',
    err =>{
        if(err) throw err;
        console.log("Файл был создан..");
        console.log("Введите текст..")
    }
);

stdin.on("data",(data)=>{
    const myBuffer = Buffer.from(data,"utf-8");
    const str = myBuffer.toString();

    if(str.trim()===".exit"){
        process.exit();
    }

    fs.appendFile(
        path.join(__dirname,'notes.txt'),
        str,
        err=>{
            if (err) throw err;
            console.log("Файл был дополнен..");
        }
    )
});

process.on('SIGINT', function() {
    process.exit();
});

process.on("exit",code=>{
    if(code === 0){
        stdout.write("До новых встреч");
    }else{
        stderr.write(`Что-то пошло не так. Программа завершилась с кодом ${code}`);
    }
});


