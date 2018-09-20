'use strict';

const generateKey = args => (
  args.map(x => x.toString() + ':' + typeof x).join('|')
);

const memoize = fn => {
  const cache = {};
  return (...args) => {
    const key = generateKey(args);
    const val = cache[key];
    if (val) return val;
    const res = fn(...args);
    cache[key] = res;
    return res;
  };
};

// Utils

const LOOP_COUNT = 10000;

const speedTest = (name, fn, args, count) => {
  const tmp = [];
  const start = new Date().getTime();
  for (let i = 0; i < count; i++) {
    tmp.push(fn(...args));
  }
  const end = new Date().getTime();
  const time = end - start;
  console.log(`${name} * ${tmp.length} : ${time}`);
};

// Usage

let fib = n => (
  (n <= 2) ? 1 : fib(n - 1) + fib(n - 2)
);

speedTest('fib(20)', fib, [20], LOOP_COUNT);

fib = memoize(fib);
speedTest('memoized fib(20)', fib, [20], LOOP_COUNT);
