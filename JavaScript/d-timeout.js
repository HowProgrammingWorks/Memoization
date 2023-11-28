'use strict';

const transKey = key => key.toString() + '(' + typeof(key) + ')';
const createKey = keys => keys.map(key => transKey(key)).join('|');

const memoizeTime = (
  // Memoize the results of the fucntion
  fn, //Function to memoize
  msec //Time for each element in cache in milliseconds
  //Returns: memoized function with limited time in the cache for each element
) => {
  const cache = new Map();
  return (...args) => {
    const key = createKey(args);
    const timeout = setTimeout(() => {
      console.log(`Delete: ${key}`);
      cache.delete(key);
    }, msec);
    if (cache.has(key)) {
      const record = cache.get(key);
      clearTimeout(record.timeout);
      record.timeout = timeout;
      console.log(
        `From cache:, ${fn.name}(${(args.join(', '))}) ${record.res}`
      );
      return record.res;
    }
    console.log(`Calculate: ${fn.name}(${args.join(', ')})`);
    const res = fn(...args);
    cache.set(key, { res, timeout });
    return res;
  };
};

const fib = n => (n <= 2 ? 1 : fib(n - 1) + fib(n - 2));

const memoTimed = memoizeTime(fib, 300);
memoTimed(2);
memoTimed(5);
memoTimed(5);
memoTimed(6);
memoTimed(2);
memoTimed(9);
memoTimed(8);
memoTimed(10);
memoTimed(8);
memoTimed(9);
setTimeout(() => {
  memoTimed(10);
  memoTimed(6);
  memoTimed(10);
  memoTimed(3);
  memoTimed(16);
  memoTimed(3);
  setTimeout(() => {
    memoTimed(10);
    memoTimed(3);
    memoTimed(2);
    memoTimed(2);
    memoTimed(10);
    memoTimed(10);
  }, 200);
}, 200);
