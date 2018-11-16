'use strict';

const memoize = (fn, msec = 100) => {
  let cache = {};

  const setTimer = msec => {
    let timer = setTimeout(() => {
      console.log('Cache cleaned');
      timer = null;
      cache = {};
    }, msec);

    return timer;
  };

  const hasKey = (key) => Object.keys(cache).includes(key);

  const timer = setTimer(msec);

  const generateKey = (args) => {
    let key = '';
    for (const arg of args)
      key += `${arg}~${typeof arg}|`;
    return key;
  };

  return (...args) => {
    if (!timer) setTimer(msec);
    const key = generateKey(args);

    if (hasKey(key)) {
      console.log(`From cache: ${args} = ${cache[key]}`);
      return cache[key];
    }

    console.log(`Calculate: ${args} = ${fn(...args)}`);
    const res = fn(...args);
    if (res !== undefined)
      cache[key] = res;
    console.log(cache);
    return res;
  };
};

const sum = (a, b) => a + b;

const sumM = memoize(sum, 2000);

//USAGE
sumM(1, -1);
sumM(1, -1);
setTimeout(() => {
  sumM(1, -1);
}, 2500);
