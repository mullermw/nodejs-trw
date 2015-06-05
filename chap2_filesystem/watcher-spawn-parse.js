"use strict";
const 
    fs = require('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2];

if (!filename) {
    throw Error("A filename must be specified!");
}

fs.watch(filename, function() {
	const ls = spawn('ls', ['-lh', filename]);
	let output = '';

	ls.stdout.on('data', function(chunk) {
		output += chunk.toString();
	    });
	
	ls.on('close', function(){
		let parts = output.split(/\s+/);
		console.dir([parts[0], parts[4], parts[8]]);
	    });

	ls.stdout.pipe(process.stdout);
});

console.log("Now watching " + filename + " for changes...");

