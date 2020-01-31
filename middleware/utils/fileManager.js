const fs = require('fs');
var utils = require("./utility");

function writeFile(file_name,content){
    fs.appendFile(file_name, content, (err) => {
        // throws an error, you could also catch it here
        if (err){
            utils.myConsoleLog("writeFile","Unable to save on file \""+file_name+"\"",2);
            throw err;  
        }else{
            utils.myConsoleLog("writeFile","File \""+file_name+"\" saved successfully!",0)
        } 
    });
}

function saveOnFile(path, estension,content){
    var today = new Date();
    var today_string = `${today.getMonth()+1}_${today.getDate()}_${today.getFullYear()}`;
    if (process.env._ && process.env._.indexOf("heroku") == -1){
        utils.myConsoleLog("saveOnFile","Writing on file-> "+today_string,0);
        writeFile(`${path}/${today_string}.${estension}`,content+'\n');
    }else{
        utils.myConsoleLog("saveOnFile","Content not saved on file because thread is running on heroku",1);
    }
}

module.exports = {
    writeFile: writeFile,
    saveOnFile: saveOnFile
}