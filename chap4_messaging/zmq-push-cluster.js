"use strict";

const
  cluster = require("cluster"),
  zmq = require('zmq'),
  fs = require("fs");
  
if (cluster.isMaster) {
  
  // master process - create PUSHER and PULLER sockets, bind endpoints
  let 
    pusher = zmq.socket('push').bind('ipc://zmq-job.ipc'),
    puller = zmq.socket('pull').bind('ipc://zmq-backchannel.ipc');
  
  //listen for workers to come online
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });
  
  let workerPids = [];
  puller.on('message', function(data) {
    let message = JSON.parse(data);
    //new worker is ready
    if (message.type === 'ready') {
      workerPids.push(workerPids);
      if (workerPids.length == 3) {
        for (let i=0; i < 100; i++) {
          pusher.send(JSON.stringify({
            type: "readFile",
            jobId: i,
            path: "target.txt"
          }));
        }
      }
    } else if (message.type === 'result') {
      console.log(data.toString());
    }
  });
  
  //fork three worker processes
  for (let i=0; i < 3; i++) {
    cluster.fork();
  }
    
} else {
  
  //worker process - create REP socket, connect to DEALER
  let puller = zmq.socket('pull').connect('ipc://zmq-job.ipc');
  let pusher = zmq.socket('push').connect('ipc://zmq-backchannel.ipc');
  
  puller.on('message', function(data) {
    //parse incoming message
    let request = JSON.parse(data);
    console.log(process.pid + ' received request for: ' + request.path);
    
    fs.readFile(request.path, function(err, data) {
      console.log(process.pid + ' sending response');
      pusher.send(JSON.stringify({
        type: "result",
        pid: process.pid,
        request : request,
        data: data.toString(),
        timestamp: Date.now()
      }));
    });
  });
  
  pusher.send(JSON.stringify({
    type: "ready",
    pid: process.pid,
  }));
}
