'use strict';

const memoize = (fn, msec = 100) => {
  let cache = {};
  let timer = setTimeout(() => {
    console.log('Cache cleaned');
    timer = null;
    cache = {};
  }, msec);

  const setTimer = msec => {
    timer = setTimeout(() => {
      console.log('Cache cleaned');
      timer = null;
      cache = {};
    }, msec);
  };

  const generateKey = (...args) => args.join('|');

  return (...args) => {
    if (!timer) setTimer(msec);
    const key = generateKey(...args);

    if (cache[key]) {
      console.log(`From cache: ${args} = ${cache[key]}`);
      return cache[key];
    }

    console.log(`Calculate: ${args} = ${fn(...args)}`);
    const res = fn(...args);
    cache[key] = res;
    console.log(cache);
    return res;
  };
};

const sum = (a, b) => a + b;

const sumM = memoize(sum, 2000);

//USAGE
sumM(1, 2);
sumM(1, 2);
setTimeout(() => {
  sumM(1, 2);
}, 2500);
