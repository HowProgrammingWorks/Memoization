'use strict';

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

function sumSeq(a, b) {
  console.log('Calculate sum');
  let r = 0;
  for (let i = a; i < b; i++) r += i;
  return r;
}

let mSumSeq = memoize(sumSeq);

console.log('First call mSumSeq(2, 5)');
console.log('Value: ' + mSumSeq(2, 5));
console.log('Second call mSumSeq(2, 5)');
console.log('From cache: ' + mSumSeq(2, 5));
console.log('Call mSumSeq(2, 6)');
console.log('Calculated: ' + mSumSeq(2, 6));
