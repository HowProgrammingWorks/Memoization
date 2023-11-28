'use strict';

const fs = require('fs');

const transKey = key => key.toString() + '(' + typeof(key) + ')';
const createKey = keys => keys.map(key => transKey(key)).join('|');
const generateKey = (keys, cb) => {
  keys = createKey(keys);
  if (cb) keys = keys + '(' + cb.length + ')';
  else keys = keys + '(' + cb + ')';
  return keys;
};

const memoizeUniv = (
  //Memoize the result of both sync and async functions
  fn, //Async or sync function to memoize
  lib = null //Library of the functions
  //Returns: memoized function
) => {
  const cache = new Map();
  const f = lib ? lib[fn] : fn;
  return (...args) => {
    let cb = null;
    if (typeof(args[args.length - 1]) === 'function') cb = args.pop();
    const key = generateKey(args, cb);
    if (cache.has(key)) {
      const record = cache.get(key);
      if (cb) {
        console.log('From cache with cb:', cb);
        cb(record.err, record.data);
        return;
      }
      console.log(`From cache:, ${f.name}(${(args.join(', '))}) ${record}`);
      return record;
    }
    console.log(`Calculate: ${f.name}(${args.join(', ')})`);
    if (cb) {
      f(...args, (err, data) => {
        cache.set(key, { err, data });
        cb(err, data);
      });
    } else {
      const res = f(...args);
      cache.set(key, res);
      return res;
    }
  };
};

//Test

const fib = n => (n <= 2 ? 1 : fib(n - 1) + fib(n - 2));

const memoSync = memoizeUniv(fib);
const memoAsync = memoizeUniv('readFile', fs);
console.log(memoSync(5));
console.log(memoSync(5));
memoAsync('4-async.js', 'utf8', (err, data) => {
  console.log('data length:', data.length);
  memoAsync('4-async.js', 'utf8', (err, data) => {
    console.log('data length:', data.length);
  });
});
