const {promisify} = require('util');
const {ok, strictEqual, deepEqual} = require('assert');
const {it, acEx, TestQueue, UnexpectedOutputError} = require('../common/spooning');

function expectDiagnosticMessage(expected, callback)
{
    return (error, {diagnosticMessage: actual}) => {

        if (error) { return callback(error); }

        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    };
}

function expectErrorMessage(expected, callback)
{
    return (error, info) => {

        if (!error) { return callback(new Error(`callback was called with value: ${info}`)); }

        const actual = error.message;
        callback(actual === expected ? null : new UnexpectedOutputError(actual, expected));
    };
}

it('Test should callback', (done) => {

    const {test, run} = new TestQueue();
    const expected = 'expected message';

    test('Should pass', (callback) => {

        callback(null, expected);

    }, expectDiagnosticMessage(expected, done));

    run();
});

it('Test should callback with error', (done) => {

    const {test, run} = new TestQueue();
    const expected = 'expected message';

    test('Should fail', (callback) => {

        callback(new Error(expected));

    }, expectErrorMessage(expected, done));

    run();
});

it('Test should resolve promise', (done) => {

    const {test, run} = new TestQueue();
    const testVow = promisify(test);
    const expected = 'expected message';

    testVow('Should pass', (callback) => {

        callback(null, expected);

    }).then(({diagnosticMessage: actual}) => {

        done(actual === expected ? null : new UnexpectedOutputError(actual, expected));

    }).catch((error) => {

        done(new Error(`promise was rejected with error: ${error}`));

    });

    run();
});

it('Test should reject promise', (done) => {

    const {test, run} = new TestQueue();
    const testVow = promisify(test);
    const expected = 'expected message';

    testVow('Should fail', (callback) => {

        callback(new Error(expected));

    }).then((info) => {

        done(new Error(`promise was resolved with value: ${info}`));

    }).catch(({message: actual}) => {

        done(actual === expected ? null : new UnexpectedOutputError(actual, expected));

    });

    run();
});

// Simple Pass

it('Test should pass', (done) => {

    const {test, run} = new TestQueue();

    test('Should pass', (callback) => {

        ok(true);
        callback();

    }, (error) => done(error));

    run();
});

it('Test should pass with message', (done) => {

    const {test, run} = new TestQueue();
    const expected = 'O hi Mark!';

    test('Should pass', (callback) => {

        ok(true);
        callback(null, expected);

    }, expectDiagnosticMessage(expected, done));

    run();
});

it('Test should pass with numeric message', (done) => {

    const {test, run} = new TestQueue();
    const expected = 123;

    test('Should pass', (callback) => {

        ok(true);
        callback(null, expected);

    }, expectDiagnosticMessage(expected, done));

    run();
});

it('Test should pass with object message', (done) => {

    const {test, run} = new TestQueue();
    const expected = {count: 4, total: 8};

    test('Should pass', (callback) => {

        ok(true);
        callback(null, expected);

    }, (error, {diagnosticMessage}) => {

        if (error) { return done(error); }

        try {
            deepEqual(diagnosticMessage, expected, acEx(diagnosticMessage, expected));
            done();
        }
        catch (e) {
            done(e);
        }
    });

    run();
});

// Simple fail

it('Test should fail', (done) => {

    const {test, run} = new TestQueue();

    test('Should fail', (callback) => {

        ok(false);
        callback();

    }, expectErrorMessage('false == true', done));

    run();
});

it('Test should fail with message', (done) => {

    const {test, run} = new TestQueue();
    const expected = 'expected error';

    test('Should fail', (callback) => {

        ok(false, expected);
        callback();

    }, expectErrorMessage(expected, done));

    run();
});

it('Test should fail comparison', (done) => {

    const {test, run} = new TestQueue();
    const expected = '\'A\' === \'B\'';

    test('Should fail', (callback) => {

        strictEqual('A', 'B');
        callback();

    }, expectErrorMessage(expected, done));

    run();
});

it('Test should fail comparison with message', (done) => {

    const {test, run} = new TestQueue();

    test('Should fail', (callback) => {

        const expected = 'BAABBB';
        const actual = 'BABBAB';
        strictEqual(actual, expected, `> ${actual}\n< ${expected}`);
        callback();

    }, expectErrorMessage('> BABBAB\n< BAABBB', done));

    run();
});

// Async

it('Test should fail nested async operation try/catch', (done) => {

    const {test, run} = new TestQueue();
    const expected = 'level 1';

    test('Should fail', (callback) => {

        setTimeout(() => {
            // If using assert (or manually throwing errors), errors must be caught within this scope
            //  See next test for equivalent callback example
            try {
                ok(false, expected);
                callback();
            }
            catch (e) {
                callback(e);
            }
        }, 100);

    }, expectErrorMessage(expected, done));

    run();

});

it('Test should fail nested async operation callback', (done) => {

    const {test, run} = new TestQueue();
    const expected = 'level 1';

    test('Should fail', (callback) => {

        setTimeout(() => {
            callback(new Error(expected));
        }, 100);

    }, expectErrorMessage(expected, done));

    run();

});
