class Memoize:
    def __init__(self, func):
        self.func = func
        self.cache = {}
    def __call__(self, *args):
        if args not in self.cache:
            self.cache[args] = self.func(*args)
        return self.cache[args]

@Memoize
def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n-1) + fib(n-2)


print('fib(0): ', fib(0))
print('fib(1): ', fib(1))
print('fib(3): ', fib(3))
print('fib(7): ', fib(7))
print('fib(10): ', fib(10))

print('fib(40): ', fib(40))
