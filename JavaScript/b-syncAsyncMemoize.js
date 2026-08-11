'use strict';

const argKeySync = x => (x.toString() + ':' + typeof(x));
const generateKeySync = arg => arg.map(argKeySync).join('|').concat('(Sync)');
const generateKeyAsync = arg => arg.slice().shift().concat('(Async)');
const fs = require('fs');

const syncAsyncMemoize = function(fn) {
  const cache = new Map();
  return (...args) => {
    if (typeof(args[args.length - 1]) === 'function') {
      const callback = args.pop();
      const key = generateKeyAsync(args);
      if (cache.has(key)) {
        const value = cache.get(key);
        console.log('Async cache');
        callback(value.err, value.data);
        return;
      }
      fn(...args, (err, data) => {
        console.log('Async calculated');
        cache.set(key, { err, data });
        callback(err, data);
      });
    } else {
      const key = generateKeySync(args);
      if (cache.has(key)) {
        const value = cache.get(key);
        console.log('from cache:', value);
        return value;
      }
      const res = fn(...args);
      cache.set(key, res);
      console.log('Calculated:', res);
      return res;
    }
  };
};
const sum = (a, b) => a + b;
const f1 = syncAsyncMemoize(sum);
f1(1, 2);
f1(1, 2);
f1(2, 2);
f1(2, 2);
f1(2, 2);

const readfile = syncAsyncMemoize(fs.readFile);
readfile('sizeMemoize.js', 'utf8', (err, data) => {
  console.log(data.length);
  readfile('sizeMemoize.js', 'utf8', (err, data) => {
    console.log(data.length);
  });
});
