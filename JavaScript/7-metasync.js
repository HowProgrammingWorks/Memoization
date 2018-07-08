'use strict';

const fs = require('fs');
const metasync = require('metasync');

// Usage

fs.readFile = metasync.memoize(fs.readFile);

fs.readFile('6-metasync.js', 'utf8', (err, data) => {
  console.log('data length: ' + data.length);
  fs.readFile('6-metasync.js', 'utf8', (err, data) => {
    console.log('data length: ' + data.length);
  });
});
