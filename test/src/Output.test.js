const fs = require('fs');
const path = require('path');
const async = require('async');
const {it, reporter: {tap}, Reporter, Tap, TestQueue, UnexpectedOutputError} = require('../common/spooning');
const MockWriteStream = require('../common/MockWriteStream');
const testExamples = require('../examples/testExamples');
const testPromiseExamples = require('../examples/testPromiseExamples');
const testSyncExamples = require('../examples/testSyncExamples');

const dumpPath = path.join(__dirname, '..', 'dump');
const examplesPath = path.join(__dirname, '..', 'examples');
const fixturesPath = path.join(__dirname, '..', 'fixtures');

const getDumpFilePath = (prefix) => path.join(dumpPath, `${prefix || ''}${new Date().getTime()}.txt`);

function compareOutputTest(expectedPath, defs, concurrency = 1)
{
    const fixtureName = path.basename(expectedPath);

    it(`TestQueue should output ${fixtureName}`, (callback) => {

        const testQueue = new TestQueue(new Reporter(new Tap(), new MockWriteStream()), {concurrency});

        defs(testQueue);

        testQueue.run(() => {

            async.waterfall([
                (cb) => fs.readFile(expectedPath, 'utf8', cb),
                (expected, cb) => {
                    const actual = testQueue.reporter.stream.toString();
                    if (actual === expected) { return cb(); }

                    // dump actual output to file
                    const actualPath = getDumpFilePath();
                    fs.writeFile(actualPath, actual, 'utf8', (error) => {
                        if (error) {
                            // if write failed, callback with UnexpectedOutputError so output is
                            //  included in diagnostic message below test result
                            const prefix = (tap.debug ? error.stack : error.message) + '\n';
                            return callback(new UnexpectedOutputError(actual, expected, prefix));
                        }
                        // otherwise callback with diff command
                        callback(new Error(`ksdiff "${actualPath}" "${expectedPath}"`));
                    });
                }
            ], callback);
        });
    });
}

compareOutputTest(path.join(examplesPath, 'testExamples.output.txt'), testExamples);

compareOutputTest(path.join(examplesPath, 'testPromiseExamples.output.txt'), testPromiseExamples);

compareOutputTest(path.join(examplesPath, 'testSyncExamples.output.txt'), testSyncExamples);

compareOutputTest(path.join(fixturesPath, 'parallel.output.txt'), ({test}) => {

    test('third', (cb) => setTimeout(cb, 210));

    test('second', (cb) => setTimeout(cb, 110));

    test('first', (cb) => setTimeout(cb, 10));

}, 3);
