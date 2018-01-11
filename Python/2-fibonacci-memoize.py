def memoize(f):
    cache = {}
    def inMemo(x):
        if x not in cache:            
            cache[x] = f(x)
        return cache[x]
    return inMemo
    

def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n-1) + fib(n-2)


fib = memoize(fib)
print('fib(40): ', fib(40))
