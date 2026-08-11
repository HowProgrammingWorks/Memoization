'use strict';

const transKey = key => key.toString() + '(' + typeof(key) + ')';
const createKey = keys => keys.map(key => transKey(key)).join('|');

const memoizeCount = (
  // Memoize the results of the fucntion
  fn, //Function to memoize
  length = 0 //Max record in the cache, if not specify records are unlimited
  //Returns: memoized function with max records count and removing least used
) => {
  const cache = new Map();
  return (...args) => {
    const key = createKey(args);
    if (cache.has(key)) {
      const record = cache.get(key);
      console.log(
        `From cache:, ${fn.name}(${(args.join(', '))}) ${record.res}`
      );
      record.count += 1;
      return record.res;
    }
    console.log(`Calculate: ${fn.name}(${args.join(', ')})`);
    const res = fn(...args);
    if (length && cache.size >= length) {
      let minUsage = length;
      let minKey;
      for (const [key, value] of cache.entries()) {
        if (value.count < minUsage) {
          minKey = key;
          minUsage = value.count;
        }
      }
      console.log(`Delete element: ${minKey}: ${cache.get(minKey).count}`);
      cache.delete(minKey);
    }
    cache.set(key, { res, count: 0 });
    return res;
  };
};

//Test

const fib = n => (n <= 2 ? 1 : fib(n - 1) + fib(n - 2));

const memoCounted = memoizeCount(fib, 7);
memoCounted(2);
memoCounted(5);
memoCounted(5);
memoCounted(6);
memoCounted(7);
memoCounted(7);
memoCounted(2);
memoCounted(9);
memoCounted(6);
memoCounted(2);
memoCounted(9);
memoCounted(2);
memoCounted(15);
memoCounted(3);
memoCounted(15);
memoCounted(3);
memoCounted(10);
memoCounted(10);
memoCounted(19);
memoCounted(18);
memoCounted(19);
memoCounted(10);
