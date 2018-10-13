'use strict';

const fs = require('fs');

// args[0] - key
// args[args.length-1] - callback
const memoizeAsync = (lib, fnName) => {
  const fn = lib[fnName];
  const cache = {};
  console.log('override', fnName);
  lib[fnName] = (...args) => {
    console.dir({ call: fnName, args, cache });
    const cb = args.pop();
    const key = args[0];
    const record = cache[key];
    console.log('key:', key);
    console.log('cached:', record);
    if (record) {
      console.log('from cache');
      cb(record.err, record.data);
      return;
    }
    fn(...args, (err, data) => {
      console.log('from file');
      console.log('Save key:', key);
      cache[key] = { err, data };
      console.dir({ cache });
      cb(err, data);
    });
  };
};

// Usage

memoizeAsync(fs, 'readFile');

fs.readFile('4-async.js', 'utf8', (err, data) => {
  console.log('data length:', data.length);
  fs.readFile('4-async.js', 'utf8', (err, data) => {
    console.log('data length:', data.length);
  });
});
