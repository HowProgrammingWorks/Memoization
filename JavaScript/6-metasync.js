'use strict';

const fs = require('fs');
const util = require('util');

// Production implementation from Metasync library
// See: https://github.com/metarhia/metasync

const metasync = {};

function Memoized() {
}

util.inherits(Memoized, Function);

metasync.memoize = (fn) => {
  const cache = new Map();

  const memoized = function(...args) {
    const callback = args.pop();
    const key = args[0];
    const record = cache.get(key);
    if (record) {
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
    maxSize: 0
  };

  Object.setPrototypeOf(memoized, Memoized.prototype);
  return Object.assign(memoized, fields);
};

Memoized.prototype.clear = function() {
  this.cache.clear();
};

// Usage

fs.readFile = metasync.memoize(fs.readFile);

fs.readFile('6-metasync.js', (err, data) => {
  console.log('data length: ' + data.length);
  fs.readFile('6-metasync.js', (err, data) => {
    console.log('data length: ' + data.length);
  });
});
