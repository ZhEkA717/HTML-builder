const path = require("path");
const fs = require("fs");
const {
    deepStrictEqual
} = require("assert");

let strHtmlContent = new Promise(resolve => {
    const arrPatternReplace = [];
    const arrNameFiles = [];
    fs.readdir(
        path.join(__dirname, "components"),
        (err, files) => {
            if (err) throw err;
            files.forEach(item => {
                fs.stat(path.join(__dirname, "components", item),
                    (error, stats) => {
                        if (error) throw error;
                        if (stats.isFile()) {
                            arrPatternReplace.push(`{{${path.parse(item).name}}}`);
                            arrNameFiles.push(item);
                        }
                        if (arrNameFiles.length === files.length) {
                            resolve([arrPatternReplace, arrNameFiles]);
                        }
                    })
            });
        });
}).then(res => {
    return new Promise(resolve => {
        const arrReadFiles = [];
        res[1].forEach((item, i) => {
            fs.readFile(
                path.join(__dirname, 'components', item),
                'utf-8',
                (err, data) => {
                    if (err) throw err;
                    arrReadFiles.push([res[0][i], data]);
                    if (arrReadFiles.length === res[1].length) {
                        resolve(arrReadFiles);
                    }
                }
            );
        });

    })
}).then(res => {
    return new Promise(resolve => {
        fs.readFile(
            path.join(__dirname, 'template.html'),
            'utf-8',
            (err, data) => {
                if (err) throw err;
                let newStr = data;
                res.forEach(item => {
                    newStr = newStr.replace(item[0], item[1]);
                })
                resolve(newStr);
            }
        );
    })
});


let bundleCssFiles = new Promise(resolve => {
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
    return new Promise(resolve => {
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
});

let createFolderAndFiles = new Promise(resolve => {
    fs.mkdir(path.join(__dirname, 'project-dist'), {
            recursive: true
        },
        err => {
            if (err) throw err;
            console.log("folder 'project-dist' was created");
            resolve();
        });
}).then(() => {
    return new Promise(resolve => {
        fs.writeFile(
            path.join(__dirname, 'project-dist', "index.html"),
            '',
            (err) => {
                if (err) throw err;
                console.log(`Файл 'index.html' был создан`);
                resolve();
            }
        );
    });
}).then(() => {
    return new Promise(resolve => {
        fs.writeFile(
            path.join(__dirname, 'project-dist', "style.css"),
            '',
            (err) => {
                if (err) throw err;
                console.log(`Файл 'style.css' был создан`);
                resolve();
            }
        );
    });
});

function appendContentInFiles(fileName, content) {
    fs.appendFile(
        path.join(__dirname, 'project-dist', fileName),
        content,
        err => {
            if (err) throw err;
            console.log(`Файл ${fileName} был изменен`);
        }
    );
}

Promise.all([strHtmlContent, bundleCssFiles, createFolderAndFiles])
    .then(result => {
        fs.readdir(
            path.join(__dirname, "project-dist"),
            (err, files) => {
                if (err) throw err.message;
                files.forEach(item => {
                    if (item === "index.html") {
                        appendContentInFiles("index.html", result[0]);
                    }
                    if (item === "style.css") {
                        result[1].forEach(cssText => {
                            appendContentInFiles("style.css", cssText);
                        })
                    }
                })
            }
        )

        return new Promise(resolve => {
            fs.mkdir(path.join(__dirname, 'project-dist', "assets"), {
                    recursive: true
                },
                err => {
                    if (err) throw err;
                    console.log("folder 'assets' was created");
                    resolve();
                });
        })
    }).then(() => {
        return new Promise(resolve => {
            function deleteFolderAndFiles(filePwd) {
                fs.readdir(
                    path.join(__dirname, filePwd),
                    (err, files) => {
                        if (err) throw err;
                        if (files.length) {
                            files.forEach(item => {
                                fs.stat(path.join(__dirname, filePwd, item),
                                    (err, stats) => {
                                        if (err) throw err;
                                        if (stats.isFile()) {
                                            fs.unlink(path.join(__dirname, filePwd, item),
                                                err => {
                                                    if (err) throw err;
                                                    console.log(`Файл ${item} успешно удален`);
                                                });
                                        } else {
                                            deleteFolderAndFiles(`${filePwd}/${item}`);
                                        }
                                    }
                                );
                            });
                        } else {
                            fs.rmdir(path.join(__dirname, filePwd), err => {
                                if (err) throw err;
                                console.log('Папка успешно удалена');
                            });
                        }
                        resolve();
                    });
            }
            deleteFolderAndFiles('project-dist/assets');
        });
    }).then(() => {
        function readAndCopyFile(filePwd) {
            fs.readdir(
                path.join(__dirname, filePwd),
                (err, elements) => {
                    if (err) throw err;
                    elements.forEach(item => {
                        fs.stat(path.join(__dirname, filePwd, item),
                            (error, stats) => {
                                if (error) throw error;
                                if (stats.isFile()) {
                                    fs.copyFile(
                                        path.join(__dirname, filePwd, item),
                                        path.join(__dirname, "project-dist", filePwd, item),
                                        err => {
                                            if (err) throw err;
                                            console.log(`file "${item}"  was copied`);
                                        }
                                    );
                                } else {
                                    fs.mkdir(path.join(__dirname, 'project-dist', `${filePwd}/${item}`), {
                                            recursive: true
                                        },
                                        err => {
                                            if (err) throw err;
                                            console.log("folder 'assets' was created");
                                            readAndCopyFile(`${filePwd}/${item}`);
                                        });
                                }
                            })
                    })

                });
        }
        readAndCopyFile("assets");
    });
