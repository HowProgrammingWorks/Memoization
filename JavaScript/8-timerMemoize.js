'use strict';

const argKey = x => (x.toString() + ':' + typeof(x));
const generateKey = arg => arg.map(argKey).join('|');

const timerMemoize = (fn, msec) => {
  const cache = new Map();
  return (...args) => {
    const key = generateKey(args);
    const timeout = setTimeout(() => cache.delete(key), msec);
    if (cache.has(key)) {
      const value = cache.get(key);
      console.log('From cache: ', value.res);
      clearTimeout(value.timeout);
      value.timeout = timeout;
      return value.res;
    }
    const res = fn(...args);
    cache.set(key, { timeout, res });
    console.log('Calculated: ', res);
    return res;
  };
};

const sum = (a, b) => a + b;
const f1 = timerMemoize(sum, 10000);
f1(1, 2);
f1(1, 2);
f1(1, 2);
f1(2, 4);
f1(2, 4);
setTimeout(() => f1(2, 4), 9000);
setTimeout(() => f1(2, 4), 12000);
setTimeout(() => f1(2, 4), 22500);
setTimeout(() => f1(2, 4), 23000);