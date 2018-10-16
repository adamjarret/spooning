---
title: Running Tests
section: User Guide
order: C
description: Define and organize tests across multiple files.
---

# {{ page.title }}

spooning does not provide any "magic" for running tests defined across multiple files
(which means that the file that calls [`run`][run] should `require` any test definition files).

If that sounds like a pain, install [spooning-cli][cli] to:

 - run all tests in files that match a glob pattern
 - automatically enable color output if the environment supports it
 - set configuration options from command line arguments

For an example of running tests defined in multiple files _without_ the CLI, read on. 

## Organizing Tests

Many programmers like to group all their tests together in a __test__ folder.
For larger projects it can be useful for tests to live alongside the code they are testing.
It is a matter of personal preference and what makes sense for a particular project
(it doesn't matter to spooning). This example assumes the following directory structure:

 - __my-project/__
   - __test/__
     - __src/__
       - hello.test.js
       - index.js
     - run.js

## Files
     
__hello.test.js__

```js
const {test} = require('spooning');

test('Should say hello', (callback) => {
    setTimeout(() => {
        callback(null, 'Hello!');
    }, 100);
});
```

__index.js__

```js
require('./hello.test.js');
```

__run.js__

```js
#!/usr/bin/env node

const {run, exit} = require('spooning');

require('./src');

run(exit);
```

## Run

Execute `node test/run.js` to run all the tests in all the files listed in __test/src/index.js__

Notice that __run.js__ calls [`run`][run] and passes the provided [`exit`][exit] callback which will exit the process with an
appropriate code when finished.

### Options

The __run.js__ file is the appropriate place to set spooning [options][TestQueue].
For example, to enable parallel test execution and change the output stream to stderr:

```js
#!/usr/bin/env node

const {run, exit, reporter, setConcurrency} = require('spooning');

require('./src');

setConcurrency(10); // run 10 tests at a time

reporter.stream = process.stderr; // write to stderr instead of stdout

run(exit);
```

### Command Line Arguments

If you want to be able to set options on the command line (without using the [CLI][cli]),
see the simple solution below.
To parse a more complex argument structure, use an external library like [minimist][minimist].

```js
const {setBail, setConcurrency, reporter: {tap}, Tap} = require('spooning');

process.argv.slice(2).forEach((arg) => {
    const concurrencyMatch = arg.match(/(-c|--concurrency)=(\d+)/);
    if (concurrencyMatch) {
        setConcurrency(parseInt(concurrencyMatch[2], 10));
    }
    else if (arg === '--bail') {
        setBail(true);
    }
    else if (arg === '--debug') {
        tap.setDebug(true);
    }
    else if (arg === '--basic-style') {
        tap.setStyle(Tap.Styles.Basic);
    }
    else if (arg === '--no-style') {
        tap.setStyle(Tap.Styles.None);
    }
});
```

If you only care about boolean flags (i.e. not concurrency), you can use [Set][Set]:

```js
const args = new Set(process.argv.slice(2));
tap.setDebug(args.has('--debug'));    
```

### Auto-Run

spooning has an auto-run feature which will start running tests as soon as they are defined
(as opposed to waiting for `run` to be called).
Enable this feature by calling [`setAutoRun(true)`][setAutoRun].

<div class="note" markdown="1">
auto-run mode has certain limitations which are outlined in the [API Documentation]({{ site.data.urls.TestQueue }}#setautorun).
</div>

To ensure that the process exits with a non-zero code if one or more tests fail in auto-run mode,
observe the [`runEnd`][events] event:

```js
#!/usr/bin/env node

const spooning = require('spooning');

spooning.on('runEnd', ({exitCode}) => process.exit(exitCode)).setAutoRun(true);

require('./src');
```

## Next Chapter

Continue to [Integration][Integration] for information on using spooning with complementary packages and services.


[minimist]: http://npmjs.com/package/minimist

[Integration]: {{ site.data.urls.Integration }}

[cli]: {{ site.data.urls.cli }}

[run]: {{ site.data.urls.TestQueue }}#run

[exit]: {{ site.data.urls.TestQueue }}#exit

[setAutoRun]: {{ site.data.urls.TestQueue }}#setautorun

[events]: {{ site.data.urls.TestQueue }}#events

[Set]: {{ site.data.urls.Set }}

[TestQueue]: {{ site.data.urls.TestQueue }}