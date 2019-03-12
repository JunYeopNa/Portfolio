var https = require('https');
var express = require('express');
var fs = require('fs');
var app = express();
var port = 9000;
var ajax_request = require('ajax-request');
var cors = require('cors');
/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})*/

//android app get action
app.get('/get', function(req, res) {

    //cross domain = 서로 다른 domain간 javascript file때문에 발생하는 문제 따라서 안드로이드와는 연관없다.
    console.log('>> send updated info to Android');
    //res.jsonp({"greeting" : "hello from server"});
    res.json({"greeting" : "hello from server"});
})

app.post('/cors_post', function(req, res) {
    var temp;
    req.on('data', function(data) {
        temp = JSON.parse(data);
        console.log(temp.temp);
    })
    req.on('end', function(data) {
        res.jsonp(temp);
    })
})

//android app post action
app.post('/post', function(req, res) {
    console.log('<< receive new info from Android');
    var info_from_client;
    req.on('data', function(data) {
        //Android에서 String형태로 날아오기 때문에 JSON object로 변환 해 주어야 한다.
        info_from_client = JSON.parse(data);
    })
    req.on('end', function(data) {
        var log_temp = "contents : \nclass = " + info_from_client.$class + 
        "\ntradeId = " + info_from_client.tradeId +
        "\nfirstName = " + info_from_client.firstName + 
        "\nlastName = " + info_from_client.lastName;

        console.log(log_temp);

        res.jsonp(info_from_client); //이부분이 Hyperledger Network로 전송되어야 할 부분이다. &ajax로 전송하기.
        res.end();
    });
})


app.get('/request_fp_info', function(req, res) {

    console.log('Request from HTML : Fingerprint Information');
    ajax_request({
        method: "GET",
        url: "http://172.20.10.8:9500/get_fp_info",
        dataType: "jsonp",
        async: true,
        data: { "hello": "dude" },
        crossDomain: true,
    }, function(err, res, body) {
        var temp_val = body;
        var json_temp = JSON.parse(temp_val)
        console.log('# : ' + json_temp.serv_finger_print);
    });

})

//웹으로부터 전송 된 info
app.get('/merged', function(req, res) {
    var re_fp = req.query.finger_print;
    var re_n = req.query.name;
    var re_p = req.query.phone;

    console.log(re_fp);
    console.log(re_n);
    console.log(re_p);

    res.jsonp({"finger_print" : re_fp, "name" : re_n, "phone" : re_p});

    //database에 저장하는 코드.
})

app.listen(port, function() {
    console.log('server started');
})