const promisify = require('util.promisify');
const {it, TestQueue} = require('../common/spooning');
const once = require('../common/once');

it('TestQueue run should callback immediately if no tests were defined', (callback) => {

    const done = once(callback);
    const {run} = new TestQueue();

    run(() => done());

    setTimeout(() => {
        done(new Error('did not immediately callback'));
    }, 10);

});

it('TestQueue run should be compatible with promisify', (callback) => {

    const done = once(callback);
    const {run} = new TestQueue();
    const runVow = promisify(run);

    runVow().then(() => done());

    setTimeout(() => {
        done(new Error('did not immediately resolve'));
    }, 10);

});
