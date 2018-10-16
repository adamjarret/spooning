const {strictEqual} = require('assert');
const {testSync, UnexpectedOutputError} = require('../../common/spooning');

testSync('UnexpectedOutputError should have correct message', () => {
    const testError = new UnexpectedOutputError('A', 'B');
    strictEqual(testError.message, 'Unexpected output\n<<<<<<< actual\nA\n=======\nB\n>>>>>>> expected');
});

testSync('UnexpectedOutputError should have correct message with prefix', () => {
    const testError = new UnexpectedOutputError('A', 'B', 'foo\n');
    strictEqual(testError.message, 'foo\n<<<<<<< actual\nA\n=======\nB\n>>>>>>> expected');
});
