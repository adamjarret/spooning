const {deepEqual} = require('assert');
const {it, acEx, TestQueue} = require('../common/spooning');
const once = require('../common/once');

function compareEmittedInfo(eventName, expectedInfo)
{
    it(`TestQueue should emit ${eventName}`, (callback) => {

        const testQueue = new TestQueue();
        const {testSync, run} = testQueue;
        const done = once(callback);

        testQueue.on(eventName, (info) => {
            try {
                deepEqual(info, expectedInfo, acEx(info, expectedInfo));
                done();
            }
            catch (e) {
                done(e);
            }
        });

        testSync('Should pass', () => {});

        run(() => done(new Error('event was not emitted before run callback')));
    });
}

compareEmittedInfo('runStart', {count: 1});

compareEmittedInfo('runEnd', {total: 1, passed: 1, exitCode: 0});

compareEmittedInfo('testResult', {idx: 1, name: 'Should pass', error: null, diagnosticMessage: undefined});
