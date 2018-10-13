'use strict';

const fs = require('fs');
const metasync = require('metasync');

// Usage

fs.readFile = metasync.memoize(fs.readFile);

fs.readFile('7-metasync.js', 'utf8', (err, data) => {
  console.log('data length:', data.length);
  fs.readFile('7-metasync.js', 'utf8', (err, data) => {
    console.log('data length:', data.length);
    fs.readFile.clear();
    fs.readFile('7-metasync.js', 'utf8', (err, data) => {
      console.log('data length:', data.length);
    });
  });
});
