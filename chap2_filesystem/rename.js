#!/usr/bin/env node --harmony

const 
    fs = require('fs');

fs.rename('foo', 'bar', new function(err) {
	if (err)
	    throw err;
    });