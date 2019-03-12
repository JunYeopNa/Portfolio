var port = 9500;
var express = require('express');
var app = express();

var received_data = '';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function delay() {
    await sleep(2000);
}


app.get('/get_fp_info', function(req, res) {
    console.log('Fingerprint information requested');


    var SerialPort = require('serialport');
//    var Readline = SerialPort.parsers.Readline;
    var sp = new SerialPort('COM7', {
        baudRate: 9600
    });


//    var parser = new Readline()
//    sp.pipe(parser);


    sp.on('open', function(){
        console.log('SerialPort opened');
        sp.on('data',function(data){ 
            received_data += '7248789' + data;
            console.log('received_data : ' + received_data);
            res.jsonp({'serv_finger_print' : received_data});
            received_data = '';
            sp.close(function(){
                console.log('SerialPort closed');
                console.log('Request handled');
            });
        });
    });
})

app.listen(port, function() {
    console.log('fp_server started');
})