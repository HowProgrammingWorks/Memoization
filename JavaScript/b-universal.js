'use strict';

const memeizeUniversal = fn => {
  const cache = {};
  const generateKey = (...args) => args.join('|');

  return (...args) => {
    let callback;
    if (typeof args[args.length - 1] === 'function')
      callback = args.pop();
    const key = generateKey(...args);

    if (cache[key]) {
      if (callback) {
        console.log(`Async cache: ${key}`);
        callback(cache[key].err, cache[key].data);
        return;
      }
      console.log(`Sync cache: ${key}`);
      return cache[key];
    }

    if (callback) {
      console.log(`Async calc: ${key}`);
      fn(...args, (err, data) => {
        cache[key] = { err, data };
        callback(err, data);
      });
      return;
    }
    console.log(`Sync calc: ${key}`);
    cache[key] = fn(...args);
    return cache[key];
  };
};

//USAGE

const fs = require('fs');

const asyncRead = memeizeUniversal(fs.readFile);

asyncRead('b-universal.js', 'utf8', (err, data) => {
  console.log('data length:', data.length);
  asyncRead('b-universal.js', 'utf8', (err, data) => {
    console.log('data length:', data.length);
  });
});

const сум = (a, b) => a + ' => ' + b;
const журба = memeizeUniversal(сум);
console.log(журба('Грушевський', 'Житомир'));
console.log(журба('Скоропадський', 'Мотовилівка'));
console.log(журба('Грушевський', 'Житомир'));
