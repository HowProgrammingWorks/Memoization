'use strict';

const LOOP = 1000000;

function memoize(fn, length) {
  let cache = {};
  let counter = 0;
  return function(...args) {
    let key = args + '';
    let val = cache[key];
    let res = val ? val : fn(...args);
    if (!val) {
      if (++counter > length) {
        delete cache[Object.keys(cache)[0]];
      }
      cache[key] = res;
    }
    return res;
  }
}

function sumSeq(a, b) {
  let r = 0
  for (let i = a; i<b; i++) r +=i;
  return r;
}

let mSumSeq = memoize(sumSeq);

function speedTest(name, fn, args, count) {
  let start = new Date().getTime();
  for (let i = 0; i < count; i++) {
    fn.apply(null, args(i));
  }
  let end = new Date().getTime();
  let time = end - start;
  console.log(name + ' * ' + count + ' : ' + time);
}

JSON.mStringify = memoize(JSON.stringify);

let rnd = (x) => Math.round(Math.random()*x);
let rnd2 = () => [1, rnd(10)];

speedTest('sumSeq', sumSeq, rnd2, LOOP);
speedTest('mSumSeq', mSumSeq, rnd2, LOOP);

speedTest('sumSeq', sumSeq, rnd2, LOOP);
speedTest('mSumSeq', mSumSeq, rnd2, LOOP);
