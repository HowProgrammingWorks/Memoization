'use strict';

const LOOP = 10000;

function memoize(fn) {
  let cache = {};
  return (...args) => {
    let key = args + '';
    let val = cache[key];
    if (val) return val;
    else {
      let res = fn(...args);
      cache[key] = res;
      return res;
    }
  }
}

function fib(n) {
  return (n <= 2) ? 1 : fib(n-1) + fib(n-2);
}

function speedTest(name, fn, args, count) {
  let start = new Date().getTime();
  for (let i = 0; i < count; i++) {
    fn.apply(null, args);
  }
  let end = new Date().getTime();
  let time = end - start;
  console.log(name + ' * ' + count + ' : ' + time);
}

speedTest('fib(20)', fib, [20], LOOP);
fib = memoize(fib);
speedTest('memoized fib(20)', fib, [20], LOOP);
