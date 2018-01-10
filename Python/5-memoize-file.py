import os, pickle
from functools import wraps

def memoize(fn):
    if os.path.exists('memoize.pkl'):
        print('Reading cache file!')
        with open('memoize.pkl') as f:
            cache = pickle.load(f)
    else:
        cache = {}

    @wraps(fn)
    def wrap(*args):
        if args not in cache:
            print('Running function with argument', args[0])
            cache[args] = fn(*args)
            # update the cache file
            with open('memoize.pkl', 'wb') as f:
                pickle.dump(cache, f)
        else:
            print('Result in cache!')
        return cache[args]
    return wrap

@memoize
def sqrt(x):
    return x**2


print(sqrt(5))
print(sqrt(5))
print(sqrt(7))
print(sqrt(5))
print(sqrt(7))