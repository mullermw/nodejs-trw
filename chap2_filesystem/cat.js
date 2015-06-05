#!/usr/bin/env node --harmony

   //this program simply writes the contents of the argument file to stdout.

    require('fs').createReadStream(process.argv[2]).pipe(process.stdout);
