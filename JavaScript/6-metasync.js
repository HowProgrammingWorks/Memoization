'use strict';

const fs = require('fs');

// Production implementation from Metasync library
// See: https://github.com/metarhia/metasync

function Memoized() {}

const memoize = fn => {
  const cache = new Map();

  const memoized = function(...args) {
    const callback = args.pop();
    const key = args[0];
    const record = cache.get(key);
    if (record) {
      console.log('Read from cache');
      callback(record.err, record.data);
      return;
    }
    fn(...args, (err, data) => {
      cache.set(key, { err, data });
      callback(err, data);
    });
  };

  const fields = {
    cache,
    timeout: 0,
    limit: 0,
    size: 0,
    maxSize: 0,
  };

  Object.setPrototypeOf(memoized, Memoized.prototype);
  return Object.assign(memoized, fields);
};

Memoized.prototype.clear = function() {
  this.cache.clear();
};

// Usage

fs.readFile = memoize(fs.readFile);

fs.readFile('6-metasync.js', 'utf8', (err, data) => {
  console.log('data length:', data.length);
  fs.readFile('6-metasync.js', 'utf8', (err, data) => {
    console.log('data length:', data.length);
    fs.readFile.clear();
    fs.readFile('6-metasync.js', 'utf8', (err, data) => {
      console.log('data length:', data.length);
    });
  });
});
