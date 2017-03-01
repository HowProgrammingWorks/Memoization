'use strict';

const LOOP = 10000;

function memoize(fn) {
  const cache = {};
  return (...args) => {
    const key = args + '';
    const val = cache[key];
    if (val) return val;
    else {
      const res = fn(...args);
      cache[key] = res;
      return res;
    }
  };
}

let fib = n => (
  (n <= 2) ? 1 : fib(n - 1) + fib(n - 2)
);

function speedTest(name, fn, args, count) {
  const start = new Date().getTime();
  for (let i = 0; i < count; i++) {
    fn(...args);
  }
  const end = new Date().getTime();
  const time = end - start;
  console.log(`${name} * ${count} : ${time}`);
}

speedTest('fib(20)', fib, [20], LOOP);
fib = memoize(fib);
speedTest('memoized fib(20)', fib, [20], LOOP);
