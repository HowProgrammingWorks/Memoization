'use strict';

const crypto = require('crypto');

const argKey = x => x.toString() + ':' + typeof x;

const generateKey = args => {
  const key = args.map(argKey).join('|');
  return crypto.createHash('sha256').update(key).digest('hex');
};

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

// Usage

const sumSeq = (a, b) => {
  console.log('Calculate sum');
  let r = 0;
  for (let i = a; i < b; i++) r += i;
  return r;
};

const mSumSeq = memoize(sumSeq);

console.log('First call mSumSeq(2, 5)');
console.log('Value:', mSumSeq(2, 5));

console.log('Second call mSumSeq(2, 5)');
console.log('From cache:', mSumSeq(2, 5));

console.log('Call mSumSeq(2, 6)');
console.log('Calculated:', mSumSeq(2, 6));
