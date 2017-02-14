'use strict';

function memoize(fn, length) {
  const cache = {};
  let counter = 0;
  return (...args) => {
    const key = args + '';
    const val = cache[key];
    const res = val ? val : fn(...args);
    if (!val) {
      if (++counter > length) {
        delete cache[Object.keys(cache)[0]];
      }
      cache[key] = res;
    }
    return res;
  };
}

function max(a, b) {
  console.log('Calculate: ' + a + '+' + b);
  return a > b ? a : b;
}

const mMax = memoize(max, 3);

console.log('mMax(10, 8)');
mMax(10, 8);
console.log('mMax(1, 15)');
mMax(1, 15);
console.log('mMax(12, 3)');
mMax(12, 3);
console.log('mMax(15, 2)');
mMax(15, 2);
console.log('mMax(1, 15)');
mMax(1, 15);
console.log('mMax(10, 8)');
mMax(10, 8);
