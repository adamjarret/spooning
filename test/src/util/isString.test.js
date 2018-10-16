const {ok} = require('assert');
const {testSync, isString} = require('../../common/spooning');

testSync('isString identifies any type of string', () => {
    ok(isString('string'), 'literal');
    ok(isString(String(0)), 'typecast');
    // noinspection JSPrimitiveTypeWrapperUsage
    ok(isString(new String(0)), 'instance');
});

testSync('isString has no false positives', () => {
    ok(!isString(undefined), 'undefined');
    ok(!isString(null), 'null');
    ok(!isString(0), 'number');
    ok(!isString({}), 'object');
    ok(!isString(() => {}), 'arrow function');
    ok(!isString(function string() {}), 'function');
    ok(!isString(/./), 'regex literal');
    ok(!isString(new RegExp('.')), 'regex instance');
    ok(!isString(new Date()), 'date instance');
});
