#!/usr/bin/env node --harmony 
/*
Test script
This test script starts a server that responds to every connection
by sending part of a ldj message, waiting 1 second, then sending the
second part of the message and closing the connection.

 */
"use strict";
const

    net = require('net'),
    server = net.createServer(function(connection) {
	    console.log('Subscriber connected');

	    //Send the first chunk immediately
	    connection.write(
	      '{"type":"changed","file":"targ'
	    );

	    //after a one second delay, send the other chunk
	    let timer = setTimeout(function() {
		    connection.write('et.txt", "timestamp":1358175758495}' + "\n");
		    connection.end();
		}, 1000);

	    connection.on('end', function() {
		    clearTimeout(timer);
		    console.log('Subscriber disconnected');
		});
	});

server.listen(5432, function() {
	console.log('Test server listening for subscribers...');
    });


