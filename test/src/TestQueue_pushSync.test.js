const {promisify} = require('util');
const {it, TestQueue, UnexpectedOutputError} = require('../common/spooning');

it('Sync Test should callback', (callback) => {

    const {testSync, run} = new TestQueue();
    const expected = 'expected message';

    testSync('Should pass', () => {

        return expected;

    }, (error, info) => {
        if (error) { return callback(error); }
        const actual = info.diagnosticMessage;
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });

    run();
});

it('Sync Test should callback with error', (callback) => {

    const {testSync, run} = new TestQueue();
    const expected = 'expected message';

    testSync('Should fail', () => {

        throw new Error(expected);

    }, (error, info) => {
        if (!error) { return callback(new Error(`callback was called with value: ${info}`)); }
        const actual = error.message;
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });

    run();
});

it('Sync Test should resolve promise', (callback) => {

    const {testSync, run} = new TestQueue();
    const testSyncVow = promisify(testSync);
    const expected = 'expected message';

    testSyncVow('Should pass', () => {

        return expected;

    }).then(({diagnosticMessage: actual}) => {
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    }, (error) => {
        callback(new Error(`promise was rejected with error: ${error}`));
    });

    run();
});

it('Sync Test should reject promise', (callback) => {

    const {testSync, run} = new TestQueue();
    const testSyncVow = promisify(testSync);
    const expected = 'expected message';

    testSyncVow('Should fail', () => {

        throw new Error(expected);

    }).then((info) => {
        callback(new Error(`promise was resolved with value: ${info}`));
    }).catch(({message: actual}) => {
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });

    run();
});
