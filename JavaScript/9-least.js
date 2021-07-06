'use strict';

const memoizeLimited = (fn, size) => {
  const cache = {};

  const generateKey = (...args) => args.join('|');

  const leastUsed = () => {
    let toDelete = Object.keys(cache)[0];
    for (const i in cache) {
      if (cache[i].uses < cache[toDelete].uses) {
        toDelete = i;
      }
    }
    console.log('Deleting', toDelete);
    return toDelete;
  };

  return (...args) => {
    const key = generateKey(...args);

    if (cache[key]) {
      console.log(`From cache: ${args}`);
      cache[key].uses++;
      return cache[key].value;
    }

    if (Object.keys(cache).length === size)
      delete cache[leastUsed()];

    const res = { value: fn(...args), uses: 0 };
    console.log(`Calculating ${args}`);
    cache[key] = res;
    return cache[key].value;
  };
};

//USAGE

const sum = (a, b) => a + b;
const sumM = memoizeLimited(sum, 3);

console.log(`sumM(1, 2) = ${sumM(1, 2)}`); //uses: 0
console.log(`sumM(2, 3) = ${sumM(2, 3)}`); //uses: 0
console.log(`sumM(1, 2) = ${sumM(1, 2)}`); //uses: 1
console.log(`sumM(2, 3) = ${sumM(2, 3)}`); //uses: 2
console.log(`sumM(1, 3) = ${sumM(1, 3)}`); //uses: 0
console.log(`sumM(5, 6) = ${sumM(5, 6)}`); //uses: 0
