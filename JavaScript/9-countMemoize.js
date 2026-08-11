'use strict';

const argKey = x => (x.toString() + ':' + typeof(x));
const generateKey = arg => arg.map(argKey).join('|');

const countMemoize = (fn, max) => {
  const cache = new Map();
  return (...args) => {
    const key = generateKey(args);
    if (cache.has(key)) {
      const value = cache.get(key);
      console.log('from cache:', value.res);
      value.count += 1;
      return value.res;
    }
    const res = fn(...args);
    console.log('Calculated:', res);
    if (cache.size > max) {
      let [deleted, { count: num }] = cache.entries().next().value;
      cache.forEach((value, keys) => {
        const count = value.count;
        if (num >= count) {
          num = count;
          deleted = keys;
        }
      });
      console.log('deleted: ', deleted);
      cache.delete(deleted);
    }
    cache.set(key, { res, count: 1 });
    return res;
  };
};

const sum = (a, b) => a + b;
const f1 = countMemoize(sum, 3);
f1(1, 2);
f1(1, 2);
f1(1, 2);
f1(2, 4);
f1(2, 4);
f1(3, 4);
f1(4, 4);
f1(4, 4);
f1(3, 4);
f1(4, 4);
f1(4, 4);
f1(5, 4);
f1(5, 4);