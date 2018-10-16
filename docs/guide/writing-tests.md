---
title: Writing Tests
section: User Guide
order: B
description: Write tests that leverage built-in helpers.
---

# {{ page.title }}

Let's start with an example function to test:

```js
const https = require('https');

function getStatus(callback)
{
    const requestOptions = {
        hostname: 'httpbin.org',
        port: 443,
        path: '/status/200',
        method: 'GET'
    };

    // Send request
    https.request(requestOptions, (response) => callback(null, response))
        .on('error', callback)
        .end();
}
```

This function makes a request to [https://httpbin.org/status/200]() and calls back with the response.

A unit test for this function could look like this:

```js
const {test, UnexpectedOutputError} = require('spooning');

test('Should respond with 200', (callback) => {

    getStatus((error, response) => {
        // test failed if getStatus called back with error
        if(error) { return callback(error); }
        
        // test failed if getStatus called back with an unexpected status code
        //  (otherwise pass)
        const statusError = new UnexpectedOutputError(response.statusCode, 200);
        callback(statusError.actual === statusError.expected ? null : statusError);
    });

});
```

[`UnexpectedOutputError`][UnexpectedOutputError] is a custom error type provided by spooning
for use in tests. Using it is entirely optional.

## Avoid "Callback Hell"

Folks eager to avoid "callback hell" should note that spooning uses [async][async]
internally and exports it for convenience. The example above could be refactored like this:

```js
const {async, test, UnexpectedOutputError} = require('spooning');

test('Should respond with 200', (callback) => {

    async.waterfall([
        getStatus,
        (response, cb) => cb(null, new UnexpectedOutputError(response.statusCode, 200)),
        (e, cb) => cb(e.actual === e.expected ? null : e)
    ], callback);

});
```

## Using Assertions

As noted in [Getting Started][GettingStarted], spooning works well with standard assertion libraries.
Here's an example that compares two objects using `deepEqual` from [assert][assert]:

```js
const https = require('https');

function getSlides(callback)
{
    const requestOptions = {
        hostname: 'httpbin.org',
        port: 443,
        path: '/json',
        method: 'GET'
    };

    // Send request
    https.request(requestOptions, (response) => callback(null, response))
        .on('error', callback)
        .end();
}

// ---

const {deepEqual} = require('assert');
const {test, acEx} = require('spooning');

test('Should respond with JSON', (callback) => {

    const expected = {
        'slideshow': {
            'author': 'Yours Truly',
            'date': 'date of publication',
            'slides': [
                {
                    'title': 'Wake up to WonderWidgets!',
                    'type': 'all'
                },
                {
                    'items': [
                        'Why <em>WonderWidgets</em> are great',
                        'Who <em>buys</em> WonderWidgets'
                    ],
                    'title': 'Overview',
                    'type': 'all'
                }
            ],
            'title': 'Sample Slide Show'
        }
    };

    getSlides((error, response) => {
        // test failed if getStatus called back with error
        if (error) { return callback(error); }

        // load response body
        const data = [];
        response.on('data', (chunk) => data.push(chunk));
        response.on('end', () => {

            try {
                // compare objects
                const actual = JSON.parse(data.join(''));
                deepEqual(actual, expected, acEx(actual, expected));
                // test passed
                callback();
            } catch (e) {
                // test failed if JSON is invalid or assertion failed
                callback(e);
            }

        });
    });

});
```

[`acEx`][acEx] is a utility provided by spooning for rendering nicely formatted error messages for
actual/expected values of any type. Using it is entirely optional.

## Next Chapter

Continue to [Running Tests][RunningTests] for examples of how to organize tests defined across multiple files.


[RunningTests]: {{ site.data.urls.RunningTests }}

[assert]: {{ site.data.urls.assert }}

[async]: {{ site.data.urls.async }}

[acEx]: {{ site.data.urls.acEx }}

[UnexpectedOutputError]: {{ site.data.urls.UnexpectedOutputError }}

[GettingStarted]: {{ site.data.urls.GettingStarted }}