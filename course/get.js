const request = require('request');


var options = {
    url: 'https://weblearn.kaikeba.com/student/opt/course/list?type=0&option=2',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer pc:301bec30392c8b9c4463682a4a036223',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    }
};

var callback = (error, response, body) => {
    console.log(body);
    // console.log(response.headers);
    console.log(response.statusCode);
}

request(options, callback);