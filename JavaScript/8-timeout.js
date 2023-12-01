'use strict';

const memoize = (fn, msec = 100) => {
  const cache = {};
  let timer = null;
  const hasKey = (key) => Object.keys(cache).includes(key);
  const generateKey = (args) => {
    let key = '';
    for (const arg of args)
      key += `${arg}~${typeof arg}|`;
    return key;
  };

  const throwGarbage = () => {
    const cleaningTime = new Date();
    const removingTime = cleaningTime - msec;

    const toDelete = Object.keys(cache)
      .filter(key => cache[key].lastUse >= removingTime);

    for (const key in cache) {
      if (toDelete.includes(key)) {
        console.log(`${key} deleted.`);
        delete cache[key];
      }
      if (Object.keys(cache).length === 0) {
        console.log('Cache is empty');
        clearInterval(timer);
        timer = null;
      }
    }
  };

  const setTimer = (msec) => {
    const timer = setInterval(() => throwGarbage(), msec);
    return timer;
  };

  timer = setTimer(msec);

  const func = (...args) => {
    if (!timer) timer = setTimer(msec);
    const key = generateKey(args);

    if (hasKey(key)) {
      console.log(`From cache: ${args} = ${cache[key].value}`);
      cache[key].lastUse = new Date();
      console.log(cache);
      return cache[key].value;
    }

    console.log(`Calculate: ${args} = ${fn(...args)}`);
    const res = fn(...args);
    if (res !== undefined)
      cache[key] = { value: res, lastUse: new Date() };
    console.log(cache);
    return res;
  };

  return func;
};

const sum = (a, b) => a + b;

const sumM = memoize(sum, 250);

//USAGE
sumM(1, -1);
sumM(2, -1);
setTimeout(() => {
  sumM(1, -1);
  setTimeout(() => sumM(2, -1), 100);
  setTimeout(() => {
    sumM(2, 3);
    setTimeout(() => sumM(3, 4), 1000);
  }, 500);
}, 200);
