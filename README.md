# spooning 

[![Build Status](https://travis-ci.org/adamjarret/spooning.svg?branch=master)](https://travis-ci.org/adamjarret/spooning)
[![Coverage Status](https://coveralls.io/repos/github/adamjarret/spooning/badge.svg?branch=master)](https://coveralls.io/github/adamjarret/spooning?branch=master)

[TAP][testanything]-producing test runner that is minimal but not uncivilized

 - [User Guide][guide]
 - [API Documentation][api]


__Sample Output__

<img src="https://adamjarret.github.io/spooning/img/ss-unicode.jpeg" alt="Styled Output" width="264" height="160" />

## Install

	npm install -D spooning
	
Requires node 6 or later. 

A [CLI][cli] is also available (which requires spooning as a peer dependency):

    npm install -D spooning spooning-cli

## Examples

Tests can be defined with any of the following functions:

 - [`test`][test] (alias: `it`)
 - [`testSync`][testSync]
 - [`testPromise`][testPromise] (alias: `swear`)

Use whatever assertion library you like (or none at all).

Call `run` (and provide an optional callback) after all tests have been defined
(skip calling `run` if you plan to use the [CLI][cli]).
Automatically running tests as they are defined is also supported [with some limitations][autoRun].

Here is a simple but complete example:

    #!/usr/bin/env node

    const {test, run, exit} = require('spooning');
    
    test('Should pass (async)', (callback) => {
        setTimeout(() => {
            callback(null, 'optional diagnostic message');
        }, 100);
    });
        
    test('Should fail (async)', (callback) => {
        setTimeout(() => {
            callback(new Error('failed'));
        }, 100);
    });
        
    // Pass the provided `exit` function to exit the process with the appropriate code
    //  (0 if all tests passed, 1 if not)
    run(exit);

For simplicity's sake, this example combines the code that runs the test with the code that defines the test.
This is almost never practical for a real project.
See [Running Tests][RunningTests] for examples of how to organize and run tests across multiple files
with or without the [CLI][cli].

If you copy the example into a file called __demo.test.js__, you can use the following command to run the tests:

    node demo.test.js
    
__Expected Output__

    1..2
    ok 1 - Should pass (async)
    # optional diagnostic message
    not ok 2 - Should fail (async)
    # ! failed
    # test: 2
    # pass: 1
    # fail: 1

### testPromise
    
Use [`testPromise`][testPromise] to define the test as a function that returns a [`Promise`][Promise] object: 

    const {testPromise} = require('spooning');

    testPromise('Should pass (promise)', () => new Promise((resolve) => {
        resolve('optional diagnostic message');
    }));

    testPromise('Should fail (promise)', () => new Promise((resolve, reject) => {
        reject(new Error('failed'));
    }));

### testSync

The [`testSync`][testSync] function is provided for defining synchronous tests: 

    const {testSync} = require('spooning');

    testSync('Should pass (sync)', () => {
        return 'optional diagnostic message';
    });

    testSync('Should fail (sync)', () => {
        throw new Error('failed');
    });

### Using Assertions

Here's an example using the native [assert][assert] library provided by node:

    const {ok, strictEqual} = require('assert');

    testSync('Should pass', () => {
       ok(true);
    });

    testSync('Should fail', () => {
       strictEqual('A', 'B');
    });

You can also use assertions (and/or throw Errors) in the root scope of async tests,
but otherwise errors have to be caught in the scope where they are thrown:

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
    
### Optional Callback

An optional callback may be provided to any of the test definition functions.
The callback will be called with an error if the test failed (`null` if it passed)
and a [TestResultInfo][TestResultInfo] object containing the test information.

    test('Should pass', (callback) => {
    
        setTimeout(() => {
            callback(null, 'optional diagnostic message');
        }, 100);
        
    }, (error, info) => {    
        // error === null|undefined
        // info === { idx: 1, name: 'Should pass', diagnosticMessage: 'optional diagnostic message' }
    });

### Returning a Promise
    
Promise purists should note that [`testPromise`][testPromise] does not automatically return a [`Promise`][Promise].
Returning a [`Promise`][Promise] that resolves/rejects when the test passes/fails is supported, but it is opt-in
to avoid "unhandled promise rejection" warnings.
Use [`promisify`][promisify] (available in the native [`util`][util] library provided by node) to wrap any
of the test function calls. `info` is a [TestResultInfo][TestResultInfo] object.
    
    const {promisify} = require('util');
    const vow = promisify(testPromise);

    vow('Should pass', () => new Promise((resolve) => {
        resolve('optional diagnostic message');
    })).then((info) => {
        // info === { idx: 1, name: 'Should pass', diagnosticMessage: 'optional diagnostic message' }
    });
    
    vow('Should fail', () => new Promise((resolve, reject) => {
        reject(new Error('error message'));
    })).catch((error) => {        
        // handle error
    });

### Observable Events

spooning emits events throughout the course of running the tests.
See the [API Documentation][events] for more information.

    const spooning = require('spooning');
    spooning.on('runEnd', ({passed, total}) => {
        // passed: count of tests that passed
        // total: count of tests that ran
    }).on('error', (error) => {
        // handle error
    });

### Other Examples

See [test/examples][examples] for additional examples.
	
## Documentation

See the [User Guide][guide] and 
[API Documentation][api].

## Development

Clone the repository and run `npm install` in the project root.	

### Run Tests

#### Run with tape

Use the `npm test` command to [lint][eslint] the code and run the unit tests using [tape][tape].
These test results are considered canonical and are used as the basis for test coverage reports.

Running the tests with `tape` (as opposed to with spooning itself) guards against any subtle
[Ouroboros][Ouroboros]-style bugs.

#### Run with spooning

Use the `npm run t` command to run the unit tests using spooning.

	Usage: npm run t [-- options]
	
	-c|--concurrency=N  # run tests in parallel, limit N (default: 10)
	--bail              # exit after first test failure
	--debug             # include stack trace in error output
	--no-style          # TAP output will be plain text (no escape-codes)
	--basic-style       # TAP output will use color escape-codes but no "icons"

__Example__

    npm run t -- --no-style --bail --debug -c=1

### Generate Coverage Reports

Use the `npm run cover` command to output a text-based coverage report.

Occasionally, the text based report will show values less than 100% but not identify any offending line numbers.
Use the `npm run cover-html` command to output a more detailed html-based coverage report to the __.coverage__ directory.

It should be noted that `nyc` is perfectly capable of generating coverage reports on
tests run with spooning.
The `tape` results are used by `npm run cover` and `npm run cover-html` to prevent any
false positives that may arise when a library tests itself.

## Built With

__Dependencies__

- [async][async] — uses `async.queue` to execute defined tests
    - [lodash][lodash] — `async` depends on `lodash` which has no dependencies

__Dev Dependencies__

- [eslint][eslint] — enforce consistent code style
- [nyc][nyc] — generate test coverage reports
- [node-coveralls][nodeCoveralls] — publish test coverage reports to [coveralls.io][coveralls]
- [tape][tape] — run unit tests ([or use spooning itself](#run-with-spooning))
- [util.promisify][pf_promisify] — polyfill for `promisify` on node < 8
	
## Contributing

Fork the repo and submit a pull request.
Contributions must have 100% test coverage and adhere to the code style enforced by eslint. 

## Versioning

[SemVer][semVer] is used for versioning.
For the versions available, see the [tags on this repository][tags]. 

## Releasing

1. Examine what will be included in the npm bundle:

        npm run pack
        
    The `npm run pack` command requires npm version 6.4.1 or later (because it uses the `--dry-run` flag).
    For older versions of npm, run `tar -tvf "$(npm pack)"` to list the contents of the generated tarball.

2. Bump the version number in __package.json__ and create a git tag:

        npm version patch

    The [`npm version`][npmVersion] command accepts a [SemVer][semVer] argument:
     `<newversion>|major|minor|patch` (where `<newversion>` is a standard version number, ex. 1.0.0).

3. Publish a new version:

        npm publish
        git push origin master --tags

## Acknowledgments

Inspired by [cupping](https://github.com/feus4177/cupping)

## Author

[Adam Jarret](https://atj.me)

## License

This project is licensed under the _MIT License_.
See the [LICENSE.txt][license] file for details.

<div align="center"><br><br>🥄</div>

[testanything]: http://testanything.org

[coveralls]: https://coveralls.io/

[semVer]: https://semver.org/

[npmVersion]: https://docs.npmjs.com/cli/version

[assert]: https://nodejs.org/api/assert.html

[util]: https://nodejs.org/api/util.html

[promisify]: https://nodejs.org/api/util.html#util_util_promisify_original

[pf_promisify]: https://www.npmjs.com/package/util.promisify

[Promise]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[async]: https://caolan.github.io/async/

[lodash]: https://lodash.com

[eslint]: https://eslint.org

[tape]: https://github.com/substack/tape

[Ouroboros]: https://en.wikipedia.org/wiki/Ouroboros

[nyc]: https://istanbul.js.org/

[nodeCoveralls]: https://github.com/nickmerwin/node-coveralls

[cli]: https://github.com/adamjarret/spooning-cli

[api]: https://adamjarret.github.io/spooning/api/

[autoRun]: https://adamjarret.github.io/spooning/api/TestQueue#setautorun

[events]: https://adamjarret.github.io/spooning/api/TestQueue#events

[test]: https://adamjarret.github.io/spooning/api/TestQueue#push

[testSync]: https://adamjarret.github.io/spooning/api/TestQueue#pushsync

[testPromise]: https://adamjarret.github.io/spooning/api/TestQueue#pushpromise

[TestResultInfo]: https://adamjarret.github.io/spooning/api/types#testresultinfo

[guide]: https://adamjarret.github.io/spooning/guide/

[RunningTests]: https://adamjarret.github.io/spooning/guide/running-tests

[tags]: https://github.com/adamjarret/spooning/tags

[examples]: https://github.com/adamjarret/spooning/tree/master/test/examples

[license]: https://github.com/adamjarret/spooning/blob/master/LICENSE.txt
