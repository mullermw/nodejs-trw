#!/usr/bin/env node --harmony

process.stdout.write(require('fs').readFileSync('target.txt').toString());