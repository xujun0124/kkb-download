var http = require('http');
var url = require('url');
var util = require('util');

// http://localhost:8888/user?name=%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B&url=www.runoob.com
http.createServer(function (request, response) {

    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

    // 解析 url 参数
    var params = url.parse(request.url, true).query;
    response.write("网站名：" + params.name);
    response.write("\n");
    response.write("网站 URL：" + params.url);
    response.write("\n");
    response.write(util.inspect(url.parse(request.url, true)));
    // 发送响应数据 "Hello World"
    response.write("\n");
    response.end('\nHello World\n');
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');