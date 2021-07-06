'use strict';

const memoizeBytes = (fn, size = '1K', logging = true) => {
  let cache = new Map();

  const generateKey = (...args) => args.join('|');

  const sizeToBytes = (size) => {
    const length = size.length;
    const data = parseFloat(size, 10);
    let k = 1;
    switch (size.charAt(length - 1)) {
      case 'T': k *= 1000;
      case 'G': k *= 1000;
      case 'M': k *= 1000;
      case 'K': k *= 1000;
      case 'B': break;
      default: break;
    }
    return data * k;
  };

  const sizeInBytes = sizeToBytes(size);

  const getSize = (obj) => {
    let bytes = 0;
    const dictTypes = {
      number: () => 8,
      boolean: () => 4,
      string: (str) => str.length * 2,
      object: (ob) => getSize(ob),
    };
    obj.forEach((value) => {
      const getBytes = dictTypes[typeof value];
      bytes += getBytes(value);
    });
    return bytes;
  };

  return (...args) => {
    const key = generateKey(...args);
    const record = cache.get(key);

    if (record) {
      if (logging) console.log(`From cache: ${key}`);
      return cache[key];
    }

    const sizeOfCache = getSize(cache);
    if (sizeOfCache >= sizeInBytes) {
      console.log(`Cache with size ${sizeOfCache} bytes cleaned`);
      cache = new Map();
    }

    if (logging) console.log(`Calculating: ${key}`);
    const res = fn(...args);
    cache.set(key, res);
    if (logging) console.dir(`Cache size: ${sizeOfCache}`);
    return res;
  };
};

//USAGE

const sum = (a, b) => a + b;
const sum1 = memoizeBytes(sum, '32B');
console.log(`sum1(1, 2) = ${sum1(1, 2)}`);
console.log(`sum1(1, 2) = ${sum1(1, 2)}`);
console.log(`sum1(2, 3) = ${sum1(2, 3)}`);
console.log(`sum1(3, 2) = ${sum1(3, 2)}`);
console.log(`sum1(4, 2) = ${sum1(4, 2)}`);
console.log(`sum1(2, 3) = ${sum1(2, 3)}`);
console.log(`sum1(1, 3) = ${sum1(1, 3)}`);

const sum2 = memoizeBytes(sum, '0.5K', false);
for (let i = 0; i < 100; i++, sum2(i, i - 1));
