'use strict';

const argKey = x => (x.toString() + ':' + typeof(x));
const generateKey = arg => arg.map(argKey).join('|');

const sizeMemoize = (fn, maxSize) => {
  const cache = new Map();
  const sizeToBytes = (size) => {
    if(/[TGMKBtgmkb]/.test(size)) {
      const k =  parseFloat(size.slice(0, size.length - 1));
      const char = size.slice(size.length - 1);
      const tableOfSize = {
        T: Math.pow(2, 40),
        G: Math.pow(2, 30),
        M: Math.pow(2, 20),
        K: Math.pow(2, 10),
        B: 1,
      };
      return tableOfSize[char.toUpperCase()] * k;
    }
    else return parseFloat(size);
  };
  const getSize = function(arg) {
    if (!arg) return 0;
    let countOfObj = 0;
    const getSizeTable = {
      number: 8,
      boolean: 4,
      string: arg.length * 2,
    };
    if (typeof(arg) === 'object') {
      for (const value of arg.values()) {
        ({ res: arg } = value);
        countOfObj += (getSizeTable[typeof(arg)] ? getSizeTable[typeof(arg)] : getSize(arg));
      }
      return countOfObj;
    } else {
      const countOfArg = getSizeTable[typeof(arg)]; 
      return countOfArg;
    }
  };
  return (...args) => {
    const key = generateKey(args);
    if (cache.has(key)) {
      const value = cache.get(key);
      console.log('from cache:', value.res);
      value.count += 1;
      return value.res;
    }
    const res = fn(...args);
    const inBytes = sizeToBytes(maxSize);
    if (getSize(res) > inBytes) {
      console.log('Size of result more than can hold cache!');
      console.log('Calculated:', res);
      return res;
    }
    while (getSize(cache) + getSize(res) > inBytes) {
      let  [deleted, { count: num }] = cache.entries().next().value;
      cache.forEach((value, key) => {
        const count = value.count;
        if (num >= count) {
          num = count;
          deleted = key;
        }
      });
      console.log('deleted:', deleted);
      cache.delete(deleted);
    }
    console.log('Calculated:', res);
    cache.set(key, { res, count: 1 });
    return res;
  };
};
const sum = (a, b) => a + b;
const f1 = sizeMemoize(sum, '20');
f1('s', 'qsssss');
f1(1, 2);
f1(1, 2);
f1(true, false);
f1(2, 4);
f1(2, 4);
f1(2, 4);
f1(3, 4);
f1('22', 4);
f1('qqqqq', 'qqqqqqq');
f1('qqqqq', 'qqqqq');
f1(4, 4);
f1('q', 4);
f1(5, 4);
f1(5, 4);



