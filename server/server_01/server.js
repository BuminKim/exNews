var http = require('http');
var fs   = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response){
  response.writeHead(404,{'Content-Type' : 'text/plain'});
  response.write('Error 404 : resource not found.');
  response.end();
}
//ファイルを提供
function sendFile(response, filePath, fileContents){
  response.writeHead( 200, {'Content-Type' : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}
//静的ファイルの提供
function serveStatic(response , cache , absPath){
  if(cache[absPath]){
    sendFile(response, absPath, cache[absPath]);
  }else{
    fs.exists(absPath, function(exists){
      if(exists){
        fs.readFile(absPath, function(err, data){
          if(err){
            send404(response);
          }else{
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      }else{
        send404(response);
      }
    })
  }
}
//HTTPサーバー
var server = http.createServer(function (request , response){
  var filePath = false;
  if(request.url == '/'){
      filePath = 'public/index.html';
  }else{
    fliePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

server.listen(3000 , function(){
  console.log("server linstening on port 3000");
})
