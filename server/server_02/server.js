//基礎的な静的ファイルサーバーを作る
//く組み込みhttpもじゅーるは、HTTPサーバー・クライアント機能を提供する
var http = require('http');
//組み込みfsモジュールは、ファイルシステム関連の機能を提供する
var fs = require('fs');
//組み込みpathモジュールは、ファイルシステムのパスに関する機能を提供する
var path = require('path');
//アドオンのmimeモジュールは、ファイルの拡張子に基づいてMIMEタイプを推論する機能を提供する
var mime = require('mime');
//cacheオブジェクトには、ファイルの内容が格納される
var cache = {};
//提供するファイルがないときはHTTP 404 ERRORを発生する
function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404 : resource not Found!!');
    response.end();
}
//ファイルデータを提供する
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, { 'Content-Tpye': mime.lookup(path.basename(filePath)) });
    response.end(fileContents);
}
//静的なファイルの提供
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]); //メモリからファイルを提供する
    }
    else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response);
                    }
                    else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }
            else {
                send404(response);
            }
        });
    }
}
// HTTP サーバー
var server = http.createServer(function (request, response) {
    console.log(request.url);
    var filePath = '';
    if (request.url == '/') {
        filePath = 'public/index.html';
    }
    else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    console.log(absPath);
    serveStatic(response, cache, absPath);
});
// リスナー
server.listen(3000, function () {
    console.log("server linstening on port 3000.");
});
