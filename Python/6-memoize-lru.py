import functools

@functools.lru_cache()
def fib_lru(n):
    if n in (0, 1):
        return n
    else:
        return fib_lru(n - 2) + fib_lru(n - 1)

print('fib_lru(0): ', fib_lru(0))
print('fib_lru(7): ', fib_lru(7))
print('fib_lru(10): ', fib_lru(10))
print('fib_lru(40): ', fib_lru(40))