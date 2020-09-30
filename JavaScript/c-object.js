'use strict';

const fs = require('fs');

const transKey = key => key.toString() + '(' + typeof(key) + ')';
const createKey = keys => keys.map(key => transKey(key)).join('|');
const generateKey = (keys, cb) => {
  keys = createKey(keys);
  if (cb) keys = keys + '(' + cb.length + ')';
  else keys = keys + '(' + cb + ')';
  return keys;
};

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

const memoizator = (
  //Memoize the results of the function
  func, //Function to memize
  lib = null //Library of the functions
  //Returns: functional object
) => {
  const cache = new Map();
  const events = new Map();
  const f = lib ? lib[func] : func;
  const memo = (...args) => {
    let cb = null;
    if (typeof(args[args.length - 1]) === 'function') cb = args.pop();
    const key = generateKey(args, cb);
    if (cache.has(key)) {
      const record = memo.get(key);
      record.count += 1;
      if (cb) {
        console.log('From cache with cb:', cb);
        cb(record.err, record.data);
        return;
      }
      console.log(`From cache: ${f.name}(${(args.join(', '))}) ${record.res}`);
      return record.res;
    }
    if (memo.maxCount) memo.checkCount();
    console.log(`Calculate: ${f.name}(${args.join(', ')})`);
    if (cb) {
      f(...args, (err, data) => {
        if (!memo.timeout) {
          if (memo.size) memo.checkSize(cache, err, data, 'count', 0);
          memo.add(key, {
            err,
            data,
            count: 0,
          });
        }
        cb(err, data);
      });
    } else {
      const res = f(...args);
      if (!memo.timeout) {
        if (memo.size) memo.checkSize(cache, res, 'count', 0);
        memo.add(key, {
          res,
          count: 0,
        });
      }
      return res;
    }
  };

  const methods = {
    clear() {
      if (events.has('clear')) this.emit('clear');
      cache.clear();
      return this;
    },
    add(key, value) {
      if (!cache.has(key)) {
        cache.set(key, value);
        if (events.has('add')) this.emit('add', cache, key);
        return this;
      }
    },
    del(key) {
      if (cache.has(key)) {
        if (events.has('del')) this.emit('del', cache, key);
        cache.delete(key);
      }
      return this;
    },
    get(key) {
      if (cache.has(key)) return cache.get(key);
    },
    setTime(msec) {
      setTimeout(() => {
        this.clear();
        this.timeout = true;
      }, msec);
      return this;
    },
    setMaxSize(size, unit = 'bytes') {
      this.size = size;
      this.unit = unit;
      this.checkSize(cache);
      return this;
    },
    checkSize(...args) {
      while (sizeOf(this.unit, ...args) > this.size) {
        console.log('\nSize check');
        const key = cache.keys().next().value;
        this.del(key);
        return this;
      }
    },
    setMaxCount(count) {
      this.maxCount = count;
      this.checkCount();
      return this;
    },
    checkCount() {
      while (cache.size >= this.maxCount) {
        console.log('\nRecords check');
        let minUsage = this.maxCount;
        let minKey = '';
        for (const [key, value] of cache.entries()) {
          if (value.count < minUsage) {
            minKey = key;
            minUsage = value.count;
          }
        }
        this.del(minKey);
      }
      return this;
    },
    on(name, fn) {
      const event = events.get(name);
      if (event) event.push;
      else events.set(name, [fn]);
      return this;
    },
    emit(name, ...data) {
      const event = events.get(name);
      event.forEach(fn => fn(...data));
      return this;
    }
  };

  return Object.assign(memo, methods);
};

//Test
const fib = n => (n <= 2 ? 1 : fib(n - 1) + fib(n - 2));

const memo = memoizator('readFile', fs);

memo('4-async.js', 'utf8', (err, data) => {
  console.log('data length:', data.length);
  memo('4-async.js', 'utf8', (err, data) => {
    console.log('data length:', data.length);
  });
});

const memoized = memoizator(fib)
  .setMaxCount(12)
  .setTime(1000)
  .setMaxSize(350)
  .on('del', (cache, key) => console.log(
    `Delete element: ${key}: ${JSON.stringify(cache.get(key))}`)
  );

memoized(5);
memoized(5);
memoized(2);
memoized(6);
memoized(5);
memoized(6);
memoized(8);
memoized(2);
memoized(3);
memoized(9);
memoized(8);
memoized(6);
memoized
  .on('add', (cache, key) => console.log(
    `Add element: ${key}: ${JSON.stringify(cache.get(key))}`)
  )
  .on('clear', () => console.log('Clear cache'));
setTimeout(() => {
  memoized(2);
  memoized(14);
  memoized(14);
  memoized(9);
  memoized(19);
  memoized(3);
  memoized(10);
  memoized(13);
  memoized(19);
  memoized(19);
  memoized(10);
  memoized(10);
  memoized(19);
  memoized(6);
  memoized(2);
  memoized.setMaxCount(5);
  setTimeout(() => {
    memoized(7);
    memoized(20);
    memoized(21);
    memoized(7);
    memoized(20);
    memoized(21);
    memoized(5);
  }, 500);
}, 500);
