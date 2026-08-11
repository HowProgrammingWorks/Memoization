'use strict';

const transKey = key => key.toString() + '(' + typeof(key) + ')';
const createKey = keys => keys.map(key => transKey(key)).join('|');

const sizeOf = (
  //Roughly calculate the size of objects
  unit, //Unit of information
  ...args //Array of object
  //Returns: number represents the size of object in the units
) => {
  let bytes = 0;
  const count = (args) => {
    args.forEach(el => size(el));
  };
  function size(
    //Calculate size of object
    obj //Object of value or reference type
    //Returns: number represents the size of object in bytes
  ) {
    if (obj !== null && obj !== undefined) {
      const type = typeof obj;
      if (type === 'number') {
        bytes += 8;
      } else if (type === 'string') {
        bytes += obj.length * 2;
      } else if (type === 'boolean') {
        bytes += 4;
      } else if (type === 'object') {
        const objClass = Object.prototype.toString.call(obj).slice(8, -1);
        if (objClass === 'Object' || objClass === 'Array') {
          for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            size(obj[key]);
          }
        } else if (objClass === 'Map') {
          for (const [key, value] of obj.entries()) {
            size(key);
            size(value);
          }
        } else bytes += obj.toString().length * 2;
      }
    }
  }
  const format = (
    //Convert bytes in the other units
    number, //number of bytes
    unit //unit in which convert
    //Returns: size of object in the other units
  ) => {
    if (unit === 'bytes') return number;
    if (unit === 'KiB') return (number / 1024).toFixed(5);
    if (unit === 'MiB') return (number / 1048576).toFixed(5);
    if (unit === 'GiB') return (number / 1073741824).toFixed(5);
    throw new Error('Unknown units');
  };

  count(args);
  return format(bytes, unit);
};

const memoizeSize = (
  //Memoize the results of the fucntion
  fn, //Function to memoize
  maxSize = 0, //Max size of cache, if not specify size is unlimited
  unit = 'bytes' //Unit of information, if not specify unit is bytes
  //Returns: memoized function with max total stored data size
) => {
  const cache = new Map();
  return (...args) => {
    const key = createKey(args);
    if (cache.has(key)) {
      console.log(
        `From cache:, ${fn.name}(${(args.join(', '))}) ${cache.get(key)}`
      );
      return cache.get(key);
    }
    console.log(`Calculate: ${fn.name}(${args.join(', ')})`);
    const res = fn(...args);
    if (sizeOf(unit, cache, key, res) > maxSize && maxSize) {
      const firstKey = cache.keys().next().value;
      console.log(`Delete element: ${firstKey}: ${cache.get(firstKey)}`);
      cache.delete(firstKey);
    }
    cache.set(key, res);
    return res;
  };
};

//Tests

const fib = n => (n <= 2 ? 1 : fib(n - 1) + fib(n - 2));

const memoSized = memoizeSize(fib, 200);
memoSized(2);
memoSized(4);
memoSized(5);
memoSized(6);
memoSized(7);
memoSized(2);
memoSized(3);
memoSized(9);
memoSized(8);
memoSized(2);
memoSized(11);
memoSized(2);
memoSized(14);
memoSized(3);
memoSized(16);
memoSized(3);
memoSized(10);
memoSized(13);
memoSized(19);
memoSized(18);
memoSized(10);
memoSized(10);
