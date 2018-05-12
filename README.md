# Chainable Error

Chainable Error is usefull when you want to specify error by creating new error, but don't want to lose old error.

## The solving problem
```js
function fetch() {
    try {
        await getData();
    } catch(err) {
        // Errors are subclasses of Error
        if (err instanceof HTTPTimeoutError) {
            throw new ServiceTimeoutError('Service request timed out'); // here we dropped stacktrace, which could be useful for logs
        }
    }
}
```

Later in logs
```
ServiceTimeoutError: Service request timed out
fetch: throw statement
```

## The solution

```js
function fetch() {
    try {
        await getData();
    } catch (err) {
        if (err instanceof HTTPTimeoutError) {
            // Errors are subclasses of ChainableError
            throw new ServiceTimeoutError('Service request timed out', err); // here we preserver old stacktrace for better debug
        }
    }
}
```


Later in logs
```
ServiceTimeoutError: Service request timed out
fetch: throw statement
caused By: HTTPTimeoutError
oldstacktrace
```


## Example

```js
// MyError.js
import ChainableError from 'chainable-error';

export default class MyError extends ChainableError {}
```

```js
// someCode.js
import MyError from 'MyError.js'

/* code */
try {
    something();
} catch (err) {
    if (err instanceof AuthError || err instanceof BadRequest || err instanceof NoData) {
        // we dont want to reveal a real reason of error
        // but want to save the reason for later debug
        throw new MyError('Wrong data', err);
    } else if (err instanceof ServerError) {
        throw new MyError('Server unavailable, try later', err);
    }

    throw new MyError('Something wrong', err);
}
```

```js
// globalHandler.js
if (err instanceof ChainableError) {
    console.error(err.fullStack()); // here we have something like
    /*
        MyError: Wrong data
        stacktrace1 until somecode.js
        caused by BadRequest
        stacktrace2 unril somecode inner methods
    */
}
```
