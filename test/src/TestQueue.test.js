const {strictEqual} = require('assert');
const {it, acEx, TestQueue, Reporter, Tap, UnexpectedOutputError} = require('../common/spooning');
const once = require('../common/once');
const MockWriteStreamError = require('../common/MockWriteStreamError');


it('TestQueue should bail', (callback) => {

    const testQueue = new TestQueue(null, {bail: true});
    const {testSync, run} = testQueue;
    const expected = 1;

    testSync('Should pass (before)', () => {});

    testSync('Should fail', () => {throw new Error('expected failure');});

    testSync('Should pass (after)', () => {});

    run((error, info) => {
        const actual = info.passed;
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });
});

it('TestQueue should autoRun', (callback) => {

    const testQueue = new TestQueue(null, {autoRun: true});
    const {testSync} = testQueue;

    testQueue.on('runEnd', ({passed, total}) => {
        try {
            strictEqual(passed, 2, acEx(passed, 2, 'passed'));
            strictEqual(total, 3, acEx(total, 3, 'total'));
            callback();
        }
        catch (e) {
            callback(e);
        }
    });

    testSync('Should pass (before)', () => {});

    testSync('Should fail', () => {throw new Error('expected failure');});

    testSync('Should pass (after)', () => {});
});

it('TestQueue should autoRun and bail', (callback) => {

    const testQueue = new TestQueue(null, {bail: true, autoRun: true});
    const {testSync} = testQueue;

    testQueue.on('runEnd', ({passed, total}) => {
        try {
            strictEqual(passed, 1, acEx(passed, 1, 'passed'));
            strictEqual(total, 2, acEx(total, 2, 'total'));
            callback();
        }
        catch (e) {
            callback(e);
        }
    });

    testSync('Should pass (before)', () => {});

    testSync('Should fail', () => {throw new Error('expected failure');});

    testSync('Should pass (after)', () => {});
});


it('TestQueue should set concurrency', (callback) => {

    const testQueue = new TestQueue();

    testQueue.setConcurrency(3);

    // This test just checks that the value was properly set.
    //  The test to make sure the setting is respected is in Ouput.test.js
    const error = new UnexpectedOutputError(testQueue.q.concurrency, 3);
    callback(error.actual === error.expected ? null : error);
});

it('TestQueue should handle falsy concurrency', (callback) => {

    const testQueue = new TestQueue();

    testQueue.setConcurrency(null);

    const error = new UnexpectedOutputError(testQueue.q.concurrency, 1);
    callback(error.actual === error.expected ? null : error);
});

it('TestQueue should report Reporter errors', (callback) => {

    const testQueue = new TestQueue(new Reporter(new Tap())); // undefined stream
    const done = once((writeError) => {
        const error = new UnexpectedOutputError(writeError.message, 'Cannot read property \'write\' of undefined');
        callback(error.actual === error.expected ? null : error);
    });

    testQueue.on('error', done);

    testQueue.testSync('Should pass', () => {});

    testQueue.run(() => {
        done(new Error('expected error was not emitted'));
    });
});

it('TestQueue should report Reporter stream errors', (callback) => {

    const testQueue = new TestQueue(new Reporter(new Tap(), new MockWriteStreamError())); // undefined stream
    const done = once((writeError) => {
        const error = new UnexpectedOutputError(writeError.message, 'should be caught');
        callback(error.actual === error.expected ? null : error);
    });

    testQueue.on('error', done);

    testQueue.testSync('Should pass', () => {});

    testQueue.run(() => {
        done(new Error('expected error was not emitted'));
    });
});