'use strict';

const memoizeBytes = (fn, size) => {
  let cache = {};

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
    for (const i in obj) {
      switch (typeof obj[i]) {
        case 'number':
          bytes += 8;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'string':
          bytes += obj[i].length * 2;
          break;
        case 'object':
          bytes += getSize(obj[i]);
          break;
        default: throw new Error('getSize: Wrong field type.');
      }
    }
    return bytes;
  };

  return (...args) => {
    const key = generateKey(...args);

    if (cache[key]) {
      console.log(`From cache: ${key}`);
      return cache[key];
    }

    if (getSize(cache) >= sizeInBytes) {
      console.log(`Cache with size ${getSize(cache)} bytes cleaned`);
      cache = {};
    }

    console.log(`Calculating: ${key}`);
    cache[key] = fn(...args);
    console.dir(`Cache size: ${getSize(cache)}`);
    return fn(...args);
  };
};

//USAGE

const sum = (a, b) => a + b;
const sumB = memoizeBytes(sum, '32B');
console.log(`sumB(1, 2) = ${sumB(1, 2)}`);
console.log(`sumB(1, 2) = ${sumB(1, 2)}`);
console.log(`sumB(2, 3) = ${sumB(2, 3)}`);
console.log(`sumB(3, 2) = ${sumB(3, 2)}`);
console.log(`sumB(4, 2) = ${sumB(4, 2)}`);
console.log(`sumB(2, 3) = ${sumB(2, 3)}`);
console.log(`sumB(1, 3) = ${sumB(1, 3)}`);
console.log(`sumB(4, 3) = ${sumB(4, 3)}`);
console.log(`sumB(9, 3) = ${sumB(1, 3)}`);
console.log(`sumB(8, 3) = ${sumB(8, 3)}`);
