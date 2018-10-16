const {strictEqual} = require('assert');
const {it, TestQueue} = require('../common/spooning');
const once = require('../common/once');

it('TestQueue exit should exit with code', (callback) => {

    const expected = 1;
    const done = once(callback);
    const testQueue = new TestQueue();

    testQueue.process = {
        exit: (code) => {
            try {
                strictEqual(code, expected);
                done();
            }
            catch (e) {
                done(e);
            }
        }
    };

    testQueue.exit(null, {exitCode: expected});

    done(new Error('exit did not call process.exit'));
});

it('TestQueue exit should emit error if present', (callback) => {

    const done = once(callback);
    const testQueue = new TestQueue();

    testQueue.on('error', () => done());

    testQueue.process = {exit: () => {}};

    testQueue.exit(new Error('expected error'), {exitCode: 1});

    done(new Error('error event was not emitted after exit'));
});
