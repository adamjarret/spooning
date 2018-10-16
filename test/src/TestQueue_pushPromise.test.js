const promisify = require('util.promisify');
const {it, TestQueue, UnexpectedOutputError} = require('../common/spooning');

it('Promise Test should callback', (callback) => {

    const {testPromise, run} = new TestQueue();
    const expected = 'expected message';

    testPromise('Should pass', () => new Promise((resolve) => {

        resolve(expected);

    }), (error, info) => {
        if (error) { return callback(error); }
        const actual = info.diagnosticMessage;
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });

    run();
});

it('Promise Test should callback with error', (callback) => {

    const {testPromise, run} = new TestQueue();
    const expected = 'expected message';

    testPromise('Should fail', () => new Promise((resolve, reject) => {

        reject(new Error(expected));

    }), (error, info) => {
        if (!error) { return callback(new Error(`callback was called with value: ${info}`)); }
        const actual = error.message;
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });

    run();
});

it('Promise Test should resolve promise', (callback) => {

    const {testPromise, run} = new TestQueue();
    const testPromiseVow = promisify(testPromise);
    const expected = 'expected message';

    testPromiseVow('Should pass', () => new Promise((resolve) => {

        resolve(expected);

    })).then(({diagnosticMessage: actual}) => {
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    }, (error) => {
        callback(new Error(`promise was rejected with error: ${error}`));
    });

    run();
});

it('Promise Test should reject promise', (callback) => {

    const {testPromise, run} = new TestQueue();
    const testPromiseVow = promisify(testPromise);
    const expected = 'expected message';

    testPromiseVow('Should fail', () => new Promise((resolve, reject) => {

        reject(new Error(expected));

    })).then((info) => {
        callback(new Error(`promise was resolved with value: ${info}`));
    }).catch(({message: actual}) => {
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    });

    run();
});
