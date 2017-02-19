'use strict';

const LOOP = 10000;

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = args + '';
    if (cache.has(key)) {
      return cache.get(key);
    }
    else {
      const res = fn(...args);
      cache.set(key, res);
      return res;
    }
  };
}

let fib = n => (n <= 2) ? 1 : fib(n - 1) + fib(n - 2);

function speedTest(name, fn, args, count) {
  let start = new Date().getTime();
  let i; //or use "var" in for(...). (no)
  for (i = 0; i < count; i++) {
    fn(...args);
  }
  let end = new Date().getTime();
  let time = end - start;
  console.log(`${name} * ${count} : ${time}`);
}

speedTest('fib(10)', fib, [10], LOOP);
speedTest('fib(15)', fib, [15], LOOP);
speedTest('fib(20)', fib, [20], LOOP);
speedTest('fib(25)', fib, [25], LOOP);
fib = memoize(fib);
speedTest('memoized fib(10)', fib, [10], LOOP);
speedTest('memoized fib(15)', fib, [15], LOOP);
speedTest('memoized fib(20)', fib, [20], LOOP);
speedTest('memoized fib(25)', fib, [25], LOOP);