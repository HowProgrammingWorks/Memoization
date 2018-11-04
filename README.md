# Memoization

Memoization of synchronous and asynchronous functions

Tasks:
+ see examples
+ implement time expiration cash
+ implement memoize with max records count and removing least used
+ implement memoize with max total stored data size
+ implement universal memoize compatible with both sync and async function
+ implement functional object with following properties methods and events:
  + `memoized.clear()` - clear cache
  + `memoized.add(key, value)` - add value to cach
  + `memoized.del(key)` - remove value from cach
  + `memoized.get(key)` - returns saved value
  + `memoized.timeout: Number` - cache timout
  + `memoized.maxSize: Number` - maximum cache size in bytes
  + `memoized.maxCount: Number` - maximum cache size in item count
  + `memoized.on('add', Function)`
  + `memoized.on('del', Function)`
  + `memoized.on('clear', Function)`
