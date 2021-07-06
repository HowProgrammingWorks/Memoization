'use strict';

const generateKey = (...args) => args.join('|');
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

const memoizator = fn => {
  let cache = {};
  const events = [];

  const func = (...args) => {
    const key = generateKey(...args);

    if (func.timeout && !func.timer) {
      func.timer = setTimeout(() => {
        cache = {};
        console.log(`Cache cleared after ${func.timeout} msec`);
      }, func.timeout);
    }

    if (cache[key]) {
      console.log(`From cache ${key}`);
      return cache[key];
    }

    if (func.maxSize && getSize(cache) >= func.maxSize) {
      console.log(`Cache with size ${getSize(cache)} bytes cleaned`);
      cache = {};
    }

    const cacheSize = Object.keys(cache).length;
    if (func.maxCount && cacheSize >= func.maxCount) {
      console.log(`Cache with length ${cacheSize} cleaned`);
    }

    console.log(`Calc ${key}`);
    cache[key] = fn(...args);
    return cache[key];
  };

  func.clear = () => {
    console.log('Cache cleared');
    cache = {};
  };

  func.add = (key, value) => {
    if (cache[key]) throw new Error('This key already exists');
    else cache[key] = value;
    console.log(`${key} added`);
  };

  func.get = (key) => cache[key];

  func.del = (key) => {
    if (cache[key]) {
      console.log(`${key} deleted`);
      delete cache[key];
      return;
    }
    console.log(`There is no ${key}`);
  };

  func.on = (name, fn) => {
    if (events[name]) throw new Error('Event already exists');
    if (!['clear', 'add', 'del'].find((el) => (el === name)))
      throw new Error('Wrong event name');
    events[name] = fn;
  };

  func.emit = (name, data) => {
    if (name === 'clear') {
      events[name](cache);
      func.clear();
      return true;
    }
    if (name === 'add') {
      const res = data.map((el) => events[name](el));
      res.map((el, key) => func.add(key, el));
      return true;
    }
    if (name === 'del') {
      const res = [];
      res.push(events[name](...data, cache));
      res.map((key) => func.del(key));
      return true;
    }
    throw new Error('Frong event name');
  };

  func.timeout = null;
  func.maxSize = null;
  func.maxCount = null;

  return func;
};

//USAGE

const sum = (a, b) => a + b;
const sumM = memoizator(sum);
console.log(sumM(1, 1));
sumM.maxCount = 3;
sumM.timeout = 100;
sumM.maxSize = 32;

sumM.on('clear', (cache) => console.dir({ cache }));
sumM.emit('clear');

const fibbo = (n) => (n < 2 ? 1 : fibbo(n - 1) + fibbo(n - 2));
sumM.on('add', fibbo);
sumM.emit('add', [1, 2, 3]);

sumM(1, 2);
sumM.on('del', (el) => generateKey(el, el + 1));
sumM.emit('del', [1]);
