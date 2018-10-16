---
title: Getting Started
section: User Guide
order: A
description: Write your first tests with spooning.
---

# {{ page.title }}

To define a unit test with spooning, pass a __name__ and a __function__ as parameters to [`spooning.test`][test].
The name usually takes the form of "Should do the thing" and the function should accept a callback and 
implement the following behavior:

 - to indicate a failure, callback with an error as the first parameter
 - to indicate a pass, callback with a "falsy" (`false|0|undefined|null`) value as the first parameter

This should be instantly familiar to those who have used callbacks before; it is the standard convention.

Two additional wrapper functions ([`testSync`][testSync] and [`testPromise`][testPromise])
are provided to make it just as easy to define synchronous tests and [`Promise`][Promise]-based tests.

In keeping with the principle that tests should look like the code they are testing,
__there is no special syntax unique to spooning tests__.

## Installing Spooning

Install spooning as a dev dependency of your project:

    npm install -D spooning

Requires node 6 or later. 
    
## Creating Your First Test

Create a file named __hello.test.js__ with the following contents:

```js
const {test, run, exit} = require('spooning');

test('Should say hello', (callback) => {
    setTimeout(() => {
        callback(null, 'Hello!');
    }, 100);
});

run(exit);
```

Congratulations! You just implemented your first unit test with spooning.
It doesn't actually check anything, but it does display a pleasant diagnostic message.

For simplicity's sake, this example combines the code that runs the test with the code that defines the test.
This is almost never practical for a real project.
See [Running Tests][RunningTests] for examples of how to organize and run tests across multiple files
with or without the [CLI][cli].

## Running Your First Test

    node hello.test.js

This should produce the following output:

    1..1
    ok 1 - Should say hello
    # Hello!
    # test: 1
    # pass: 1
    # fail: 0
    
## Wrapper Functions

The [`testSync`][testSync] and [`testPromise`][testPromise] functions provide a way to define
synchronous and [`Promise`][Promise]-based tests, respectively.

### testPromise
    
Use [`testPromise`][testPromise] to define the test as a function that returns a [`Promise`][Promise] object: 

```js
const {testPromise} = require('spooning');

testPromise('Should pass (promise)', () => new Promise((resolve) => {
    resolve('optional diagnostic message');
}));

testPromise('Should fail (promise)', () => new Promise((resolve, reject) => {
    reject(new Error('failed'));
}));
```

### testSync

The [`testSync`][testSync] function is provided for defining synchronous tests: 

```js
const {testSync} = require('spooning');

testSync('Should pass (sync)', () => {
    return 'optional diagnostic message';
});

testSync('Should fail (sync)', () => {
    throw new Error('failed');
});
```

## Using Assertions

Here's an example using the native [assert][assert] library provided by node:

```js
const {ok, strictEqual} = require('assert');

testSync('Should pass', () => {
   ok(true);
});

testSync('Should fail', () => {
   strictEqual('A', 'B');
});
```

You can also use assertions (and/or throw Errors) in the root scope of async tests,
but otherwise errors have to be caught in the scope where they are thrown:

```js
test('Should fail with assert (root scope)', (callback) => {
    ok(false, 'failed');
    callback();
});

test('Should fail with assert (other scope)', (callback) => {
    setTimeout(() => {
        try {
            ok(false, 'failed');
            callback();
        }
        catch(e) {
            callback(e);
        }
    }, 100);
});
```

## Optional Callback

An optional callback may be provided to any of the test definition functions.
The callback will be called with an error if the test failed (`null` if it passed)
and a [TestResultInfo][TestResultInfo] object containing the test information.

```js
test('Should pass', (callback) => {

    setTimeout(() => {
        callback(null, 'optional diagnostic message');
    }, 100);
    
}, (error, info) => {    
    // error === null
    // info === { idx: 1, name: 'Should pass', diagnosticMessage: 'optional diagnostic message', error: null }
});
```

## Returning a Promise
    
Promise purists should note that [`testPromise`][testPromise] does not automatically return a [`Promise`][Promise].
Returning a [`Promise`][Promise] that resolves/rejects when the test passes/fails is supported, but it is opt-in
to avoid "unhandled promise rejection" warnings.
Use [`promisify`][promisify] (available in the native [`util`][util] library provided by node) to wrap any
of the test function calls. `info` is a [TestResultInfo][TestResultInfo] object.
    
```js
const {promisify} = require('util');
const vow = promisify(testPromise);

vow('Should pass', () => new Promise((resolve) => {
    resolve('optional diagnostic message');
})).then((info) => {
    // info === { idx: 1, name: 'Should pass', diagnosticMessage: 'optional diagnostic message', error: null }
});

vow('Should fail', () => new Promise((resolve, reject) => {
    reject(new Error('error message'));
})).catch((error) => {        
    // handle error
});
```

## Observable Events

spooning emits events throughout the course of running the tests.
See the [API Documentation][events] for more information.

```js
const spooning = require('spooning');
spooning.on('runEnd', ({passed, total}) => {
    // passed: count of tests that passed
    // total: count of tests that ran
}).on('error', (error) => {
    // handle error
});
```

## Next Chapter

Continue to [Writing Tests][WritingTests] for more practical examples.


[WritingTests]: {{ site.data.urls.WritingTests }}

[assert]: {{ site.data.urls.assert }}

[promisify]: {{ site.data.urls.promisify }}

[util]: {{ site.data.urls.nodeUtil }}

[cli]: {{ site.data.urls.cli }}

[Promise]: {{ site.data.urls.Promise }}

[RunningTests]: {{ site.data.urls.RunningTests }}

[events]: {{ site.data.urls.TestQueue }}#events

[test]: {{ site.data.urls.TestQueue }}#push

[testSync]: {{ site.data.urls.TestQueue }}#pushsync

[testPromise]: {{ site.data.urls.TestQueue }}#pushpromise

[run]: {{ site.data.urls.TestQueue }}#run

[TestResultInfo]: {{ site.data.urls.TestResultInfo }}