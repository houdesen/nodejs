const fs = require("fs");
const path = require("path");

//输入命令行时用引号，防止因空格而被视为两个参数
var arg = process.argv[2];

switch(arg){
    case "list":
        showList();
        break;
    case "mkdir folder":
        fs.mkdirSync("folder");
        break;
    default:
        console.log("something error");
        break
}

//显示该文件目录的所有文件信息
function showList(res){
    var list = [];
    var fileObj={};
    var filePath = path.join(__dirname);
    var files = fs.readdirSync(filePath);
    for(var i=0;i<files.length;i++){
        var childPath = path.join(filePath,files[i]);
        var statObj = fs.statSync(childPath);
        fileObj.fileName=files[i];
        fileObj.fileSize=statObj.size;
        list.push(fileObj);
    }
    //转换JSON字符串美观输出
    var listStr = JSON.stringify(list,null,2);
    console.log(listStr);
}