'use strict';

const transKey = key => key.toString() + '(' + typeof(key) + ')';
const createKey = keys => keys.map(key => transKey(key)).join('|');

const memoizeTime = (
  // Memoize the results of the fucntion
  fn, //Function to memoize
  timeout = 0 //Time in milliseconds, if not specify time is unlimited
  //Returns: memoized function with time expiration cache
) => {
  const cache = new Map();
  if (timeout) setTimeout(() => {
    console.log('Clear cache');
    cache.clear();
    timeout = true;
  }, timeout);
  return (...args) => {
    const key = createKey(args);
    if (cache.has(key)) {
      console.log(
        `From cache:, ${fn.name}(${(args.join(', '))}) ${cache.get(key)}`
      );
      return cache.get(key);
    }
    console.log(`Calculate: ${fn.name}(${args.join(', ')})`);
    const res = fn(...args);
    if (timeout !== true) cache.set(key, res);
    return res;
  };
};

//Test
const fib = n => (n <= 2 ? 1 : fib(n - 1) + fib(n - 2));

const memoTimed = memoizeTime(fib, 500);
memoTimed(2);
memoTimed(5);
memoTimed(5);
memoTimed(6);
memoTimed(2);
memoTimed(2);
memoTimed(8);
memoTimed(9);
memoTimed(8);
memoTimed(9);
setTimeout(() => {
  memoTimed(10);
  memoTimed(2);
  memoTimed(10);
  memoTimed(3);
  memoTimed(16);
  memoTimed(3);
  memoTimed(10);
  memoTimed(3);
  memoTimed(2);
  memoTimed(2);
  memoTimed(10);
  memoTimed(10);
}, 1000);
