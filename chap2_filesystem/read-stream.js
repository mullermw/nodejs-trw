#!/usr/bin/env node --harmony
const
    fs = require('fs'),
    stream = fs.createReadStream(process.argv[2]);
stream.on('data', function(chunk) {
	process.stdout.write(chunk);
    });

stream.on('error', function(error) {
	process.stderr.write("ERROR:" + error.message + "\n");
    });
