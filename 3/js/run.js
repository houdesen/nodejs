const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const querystring = require('querystring');
const https = require("https");
const cheerio = require("cheerio");


http.createServer(function(req,res){
    var urlObj = url.parse(req.url,true);
    var pathName = urlObj.pathname;
    console.log(pathName);
    if(pathName == "/login"){
        showLogin(res);
    }else if(pathName.indexOf("css") >= 0){
        showCss(res,pathName);
    }else if(pathName.indexOf(".png") >= 0 || pathName.indexOf(".jpg") >= 0 || pathName.indexOf(".gif") >= 0){
        showImage(res,pathName);
    }else if(pathName == "/list"){
        showList(res)
    }else if(pathName == "/listmanager"){
        showListManager(res);
    }else if(pathName == "/addChapter"){
        showAddChapter(res);
    }else if(pathName == "/load" && req.method == "POST"){
        checkMess(req,res,urlObj);
    }else if(pathName == "/getContent"){
        showContent(res);
    }else if(pathName == "/detail"){
        // console.log(urlObj.query.chapterId);
        // console.log(req.method);
        var detailPath = path.join(__dirname,"../chapter.html");
        var detailContent = fs.readFileSync(detailPath);
        res.writeHead(200,{"Content-Type":"text/html,charset:utf-8"});
        res.write(detailContent);
        res.end();
    }else if(pathName == "/getDetail" && req.method == "GET"){
        var contentPath = path.join(__dirname,"/content.json");
        var content =  fs.readFileSync(contentPath,'utf8');
        content = JSON.parse(content);
        for(var i=0; i<content.length; i++){
            if(content[i].chapterId == urlObj.query.chapterId){
                res.writeHead(200,{"Content-Type":"text/html,charset:utf-8"});
                res.end(JSON.stringify(content[i]));
            }
        }
    }else if(pathName == "/add"){
        addContent(req,res);
    }else if(pathName == '/del'){
        delContent(req,res);
    }
}).listen(8083);

//login.html
function showLogin(res){
    var indexPath = path.join(__dirname,"../login.html");
    var fileContent = fs.readFileSync(indexPath);
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(fileContent);
    res.end();
}

//chapterList.html
function showList(res){
    var indexPath = path.join(__dirname,"../chapterList.html");
    var fileContent = fs.readFileSync(indexPath);
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(fileContent);
    res.end();
}

//list.html
function showListManager(res){
    var indexPath = path.join(__dirname,"../list.html");
    var fileContent = fs.readFileSync(indexPath);
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(fileContent);
    res.end();
}

//addChapter.html
function showAddChapter(res){
    var indexPath = path.join(__dirname,"../addChapter.html");
    var fileContent = fs.readFileSync(indexPath);
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(fileContent);
    res.end();
}

//显示css
function showCss(res,pathName){
    var cssPath = path.join(__dirname,"../"+pathName);
    var cssContent = fs.readFileSync(cssPath);
    res.writeHead(200,{"Content-Type":"text/css"});
    res.write(cssContent);
    res.end();
}

//显示图片
function showImage(res,pathName){
    // console.log(pathName);
    var imgPath = path.join(__dirname,"../"+pathName);
    var imgContent = fs.readFileSync(imgPath);
    res.writeHead(200,{"Content-Type":"image/"});
    res.write(imgContent);
    res.end();
}

//验证登录
function checkMess(req,res,urlObj){
    var userPath = path.join(__dirname,"/user.json");
    var userContent =  fs.readFileSync(userPath,'utf8');
    var userData = JSON.parse(userContent.toString());    

    var userStr ='';
    req.on('data',function(chunk){
        userStr+=chunk;
    })
    req.on('end', function () {
        var obj= querystring.parse(userStr);//定义一个对象来存放解析后的值
        // console.log(obj.username);
        if(obj.username == userData[0].username && obj.pwd == userData[0].pwd){
            res.writeHead(200,{"Content-Type":"text/html,charset=utf-8"});
            res.end("Landing successfully");
        }else{
            res.writeHead(200,{"Content-Type":"text/html,charset=utf-8"});
            res.end("The user name or password you entered is wrong, please re-enter");
        }
    })
}

//显示博客列表界面
function showContent(res){
    var contentPath = path.join(__dirname,"/content.json");
    var content =  fs.readFileSync(contentPath,'utf8');
    // var data = JSON.stringify(content);
    res.writeHead(200,{"Content-Type":"text/html,charset:utf-8"});
    res.end(content);
}

//向content.json添加数据
function addContent(req,res){
    var contentPath = path.join(__dirname,"/content.json");
    var content =  fs.readFileSync(contentPath,'utf8');
    content = JSON.parse(content);

    var dataStr ='';
    req.on('data',function(chunk){
        dataStr+=chunk;
    })
    req.on('end', function () {
        var dataObj= querystring.parse(dataStr);//定义一个对象来存放解析后的值
        var obj = {
            "chapterId": content.length+1,
            "chapterName": dataObj.title,
            "imgPath": "",
            "chapterDes": "",
            "chapterContent": dataObj.content,
            "publishTimer": "2019-08-19",
            "author": "admin",
            "views": 1
        }
        content.push(obj);
        // console.log(content);
        fs.writeFile('./content.json',JSON.stringify(content,null,'\t'),function(err){
            if(err){
                console.error(err);
            }
            console.log('----------新增成功-------------');
        })
        res.end();
    })
}

function delContent(req,res){
    // var contentPath = path.join(__dirname,"/content.json");
    // var content =  fs.readFileSync(contentPath,'utf8');
    // content = JSON.parse(content);

    // var dataStr ='';
    // req.on('data',function(chunk){
    //     dataStr+=chunk;
    // })
    // req.on('end', function () {
    //     var dataObj= querystring.parse(dataStr);//定义一个对象来存放解析后的值
    //     fs.writeFile('./content.json',JSON.stringify(content,null,'\t'),function(err){
    //         if(err){
    //             console.error(err);
    //         }
    //         console.log('----------删除成功-------------');
    //     })
    //     res.end();
    // })
}