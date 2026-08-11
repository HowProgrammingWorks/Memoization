'use strict';

const fs = require('fs');

const argKeySync = x => (x.toString() + ':' + typeof(x));
const generateKeySync = arg => arg.map(argKeySync).join('|').concat('(Sync)');
const generateKeyAsync = arg => arg.slice().shift().concat('(Async)');

const sizeToBytes = (size) => {
  if (/[TGMKBtgmkb]/.test(size)) {
    const k =  parseFloat(size.slice(0, size.length - 1));
    const char = size.slice(size.length - 1);
    const tableOfSize = {
      T: Math.pow(2, 40),
      G: Math.pow(2, 30),
      M: Math.pow(2, 20),
      K: Math.pow(2, 10),
      B: 1,
    };
    return tableOfSize[char.toUpperCase()] * k;
  } else return parseFloat(size);
};
const getSize = function(arg) {
  if (!arg) return 0;
  let countOfObj = 0;
  const getSizeTable = {
    number: 8,
    boolean: 4,
    string: arg.length * 2,
  };
  if (typeof(arg) === 'object') {
    for (const value of arg.values()) {
      ({ res: arg } = value);
      countOfObj += (getSizeTable[typeof(arg)] ?
        getSizeTable[typeof(arg)] :
        getSize(arg));
    }
    return countOfObj;
  } else {
    const countOfArg = getSizeTable[typeof(arg)];
    return countOfArg;
  }
};
const memoizeUnity = function(fn) {
  let cache = new Map();
  const events = new Map();
  const memoized = (...args) => {
    if (typeof(args[args.length - 1]) === 'function') {
      const callback = args.pop();
      const key = generateKeyAsync(args);
      if (cache.has(key)) {
        const value = memoized.get(key);
        callback(value.err, value.res);
        return;
      }
      fn(...args, (err, res) => {
        const value = memoized.add(key, { err, res });
        callback(value.err, value.res);
        return;
      });
    } else {
      const key = generateKeySync(args);
      if (cache.has(key)) {
        return memoized.get(key);
      }
      const res = fn(...args);
      memoized.add(key, { res });
    }
  };

  const methods = {
    clear() {
      console.log('Cache is cleared');
      if (events.has('clear')) memoized.emit('clear', cache);
      cache = new Map();
    },
    add(key, res) {
      const result = res.res;
      if (events.has('add')) memoized.emit('add', res);
      if (this.maxSize < getSize(result)) {
        console.log('Size of result more than can hold cache!');
        console.log('Calculated:', result);
        return result;
      }
      this.checkMaxSize(res.res);
      this.checkMaxCount();
      if (this.time) {
        res.timer = setTimeout(this.del, this.time, key);
      }
      console.log(`\x1b[32mNew value: ${res.res} is added to the cache`);
      res.count = 1;
      cache.set(key, res);
      return res;
    },
    del(key) {
      const value = cache.get(key);
      clearTimeout(value.timer);
      if (events.has('del')) memoized.emit('del', value);
      console.log(`\x1b[31mValue: ${value.res} is deleted from the cache`);
      cache.delete(key);
    },
    get(key) {
      const value = cache.get(key);
      console.log('\x1b[33mReturned value from cache:', value.res);
      if (this.time) {
        clearTimeout(value.timer);
        value.timer = setTimeout(this.del, this.time, key);
      }
      value.count += 1;
      return value;
    },
    timeout(msec) {
      this.time = msec;
      if (this.time) {
        cache.forEach((el, key) => {
          console.log(el);
          el.timer = setTimeout(this.del, msec, key);
        });
      }
      return this;
    },
    setMaxCount(max) {
      this.maxCount = max ? max : 0;
      this.checkMaxCount();
      return this;
    },
    checkMaxCount() {
      if (this.maxCount) {
        while (cache.size >= this.maxCount) {
          this.countChecker();
        }
      }
    },
    setMaxSize(max) {
      this.maxSize = sizeToBytes(max) ? sizeToBytes(max) : 0;
      this.checkMaxSize();
      return this;
    },
    checkMaxSize(res) {
      if (this.maxSize) {
        while (getSize(cache) + getSize(res) > this.maxSize) {
          this.countChecker();
        }
      }
    },
    countChecker() {
      let [deleted, { count: num }] = cache.entries().next().value;
      cache.forEach((value, key) => {
        const count = value.count;
        if (num >= count) {
          num = count;
          deleted = key;
        }
      });
      this.del(deleted);
    },
    on(name, callback) {
      const event = events.get(name);
      if (event) event.push(callback);
      else events.set(name, [callback]);
    },
    emit(name, ...data) {
      const event = events.get(name);
      if (event) event.forEach(fn => fn(...data));
    }
  };
  Object.assign(memoized, methods);
  return Object.assign(memoized, methods);
};


const sum = (a, b) => a + b;
const f1 = memoizeUnity(sum);
f1.timeout(300).setMaxCount(3).setMaxSize('40B');
f1(1, 1);
f1(1, 1);
setTimeout(() => f1(1, 1), 300);
f1(1, 1);
f1(1, 1);
f1(2, 1);
f1(2, 1);
f1(3, 1);
f1(3, 1);
f1(4, 1);
setTimeout(f1, 1488, '\x1b[41m\x1b[33m\x1b[3mNa ', 'Dooooooppppppppkkkyyyyyyy');
f1.on('del', data => {
  console.log(`Deleted: ${data.res}`);
});

const f2 = memoizeUnity(fs.readFile);
f2('./timerMemoize.js', 'utf8', (err, data) => {
  if (err) console.log(err.message);
  console.log('data length:', data.length);
  f2('./timerMemoize.js', 'utf8', (err, data) => {
    if (err) console.log(err.message);
    console.log('data length:', data.length);
  });
});
