'use strict';

function memoize(fn, length) {
  const cache = new Map();
  return (...args) => {
    const key = args + '';
    if (cache.has(key)) return cache.get(key);
    const res = fn(...args);
    if (cache.size >= length) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, res);
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
console.log('mMax(0, 0)');
mMax(0, 0);
console.log('mMax(0, 0)');
mMax(0, 0);
console.log('mMax(false, false)');
mMax(false, false);
console.log('mMax(false, false)');
mMax(false, false);
console.log('mMax(undefined, undefined)');
mMax(undefined, undefined);
console.log('mMax(undefined, undefined)');
mMax(undefined, undefined);
