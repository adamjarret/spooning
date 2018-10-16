const {strictEqual} = require('assert');
const {testSync, maybeStringify} = require('../../common/spooning');

testSync('maybeStringify handles string value', () => {
    strictEqual(maybeStringify('string'), 'string');
});

testSync('maybeStringify handles object value', () => {
    strictEqual(maybeStringify({string: 'foo'}), '{\n  "string": "foo"\n}');
});

testSync('maybeStringify handles undefined value', () => {
    strictEqual(maybeStringify(), undefined);
});

testSync('maybeStringify handles null value', () => {
    strictEqual(maybeStringify(null), 'null');
});

testSync('maybeStringify handles boolean value', () => {
    strictEqual(maybeStringify(true), 'true');
});

testSync('maybeStringify handles date value', () => {
    strictEqual(maybeStringify(new Date(Date.UTC(2018, 9, 7, 23, 11, 43, 81))), '"2018-10-07T23:11:43.081Z"');
});

testSync('maybeStringify handles number value', () => {
    strictEqual(maybeStringify(123), '123');
});
