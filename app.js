var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var amqp = require('amqplib/callback_api');
app.use(bodyParser.json());


var nbClients=0;
io.sockets.on('connection',function (socket) {
    ++nbClients;
    console.log("Connection du client Numéro :"+nbClients);

    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'app_queue';

            ch.assertQueue(q, {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function(msg) {
                console.log(" [x] Received %s", msg.content);
                if( msg.content== "ajoutdeSociete"){
                    console.log("here");
                    io.sockets.emit('AjoutSociete',{message: msg.content})

                }else {
                    console.log("here2");

                    io.sockets.emit('AjoutOrdre',{message:String.fromCharCode.apply(null, new Uint16Array(msg.content))})

                }
                console.log("\n");
            }, {noAck: true});
        });


    });


})

server.listen(8082,function () {
    console.log("Démarrage du serveur sur le port 8082")
});