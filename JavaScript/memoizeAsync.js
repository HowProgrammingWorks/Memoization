'use strict';

global.api = {};
api.fs = require('fs');

// args[0] - key
// args[args.length-1] - callback
let memoizeAsync = (lib, fnName) => {
  let fn = lib[fnName];
  let cache = {};
  console.log('override ' + fnName);
  lib[fnName] = function(...args) {
    console.dir({call: fnName, args, cache });
    let cb = args.pop();
    let record = cache[args[0]];
    console.log('key: ' + args[0]);
    console.log('cached: ' + record);
    if (record) {
      console.log('from cache');
      cb(record.err, record.data);
    } else fn(...args, (err, data) => {
      console.log('from file');
      console.log('Save key: ' + args[0]);
      cache[args[0]] = { err, data };
      console.dir({cache});
      cb(err, data);
    });
  };
};

memoizeAsync(api.fs, 'readFile');

api.fs.readFile('memoizeAsync.js', (err, data) => {
  console.log('data length: ' + data.length);
  api.fs.readFile('memoizeAsync.js', (err, data) => {
    console.log('data length: ' + data.length);
  });
});
