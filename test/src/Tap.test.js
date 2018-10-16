const {ok, strictEqual} = require('assert');
const {testSync, acEx, Tap} = require('../common/spooning');

const tap = new Tap();
const tapDebug = new Tap(null, true);

testSync('Tap should render plan (count: 0)', () => {
    strictEqual(tap.renderPlan(0), '0..0');
});

testSync('Tap should render plan (count: 4)', () => {
    strictEqual(tap.renderPlan(4), '1..4');
});

testSync('Tap should render result (ok)', () => {
    strictEqual(tap.renderResult(true, 1), 'ok 1');
});

testSync('Tap should render result (not ok)', () => {
    strictEqual(tap.renderResult(false, 1), 'not ok 1');
});

testSync('Tap should render result (empty message)', () => {
    strictEqual(tap.renderResult(true, 1, ''), 'ok 1');
});

testSync('Tap should render result (message)', () => {
    strictEqual(tap.renderResult(true, 1, 'Test message'), 'ok 1 - Test message');
});

testSync('Tap should render diagnostic', () => {
    strictEqual(tap.renderDiagnostic('Test message'), '# Test message');
});

testSync('Tap should render empty diagnostic', () => {
    strictEqual(tap.renderDiagnostic(''), '');
});

testSync('Tap should render falsy diagnostic', () => {
    strictEqual(tap.renderDiagnostic(), '');
});

testSync('Tap should render multi-line diagnostic', () => {
    const expected = '# Test message\n# Second line\n# Third line';
    strictEqual(tap.renderDiagnostic('Test message\nSecond line\nThird line'), expected);
});

testSync('Tap should render multi-line diagnostic with prefix', () => {
    const expected = '# ! Test message\n# ! Second line\n# ! Third line';
    strictEqual(tap.renderDiagnostic('Test message\nSecond line\nThird line', '# ! '), expected);
});

testSync('Tap should handle start (undefined)', () => {
    const expected = '0..0';
    const actual = tap.handleStart({});
    strictEqual(actual, expected);
});

testSync('Tap should handle start (0)', () => {
    const expected = '0..0';
    const actual = tap.handleStart({count: 0});
    strictEqual(actual, expected);
});

testSync('Tap should handle start (4)', () => {
    const expected = '1..4';
    const actual = tap.handleStart({count: 4});
    strictEqual(actual, expected);
});

testSync('Tap should handle end (0/0)', () => {
    const info = {total: 0, passed: 0};
    const expected = '# test: 0\n# pass: 0\n# fail: 0';
    const actual = tap.handleEnd(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle end (1/0)', () => {
    const info = {total: 1, passed: 0};
    const expected = '# test: 1\n# pass: 0\n# fail: 1';
    const actual = tap.handleEnd(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle end (1/1)', () => {
    const info = {total: 1, passed: 1};
    const expected = '# test: 1\n# pass: 1\n# fail: 0';
    const actual = tap.handleEnd(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (ok)', () => {
    const info = {idx: 1};
    const expected = 'ok 1';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (ok with name)', () => {
    const info = {idx: 1, name: 'expected message'};
    const expected = 'ok 1 - expected message';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (ok with message)', () => {
    const info = {idx: 1, diagnosticMessage: 'expected message'};
    const expected = 'ok 1\n# expected message';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (ok with name and message)', () => {
    const info = {idx: 1, name: 'name', diagnosticMessage: 'expected message'};
    const expected = 'ok 1 - name\n# expected message';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (not ok)', () => {
    const info = {idx: 1, error: new Error('expected failure')};
    const expected = 'not ok 1\n# ! expected failure';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (not ok with name)', () => {
    const info = {idx: 1, error: new Error('expected failure'), name: 'name'};
    const expected = 'not ok 1 - name\n# ! expected failure';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (not ok with message)', () => {
    const info = {idx: 1, error: new Error('expected failure'), diagnosticMessage: 'expected message'};
    const expected = 'not ok 1\n# expected message\n# ! expected failure';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (not ok with name and message)', () => {
    const info = {idx: 1, error: new Error('expected failure'), name: 'name', diagnosticMessage: 'expected message'};
    const expected = 'not ok 1 - name\n# expected message\n# ! expected failure';
    const actual = tap.handleResult(info);
    strictEqual(actual, expected);
});

testSync('Tap should handle result (debug)', () => {
    const info = {idx: 1, error: new Error('expected failure')};
    const actual = tapDebug.handleResult(info);
    ok(actual.indexOf('! Error: expected failure') >= 0, 'output does not contain stack');
});

testSync('Tap should handle result (debug with string error)', () => {
    const info = {idx: 1, error: 'expected failure'};
    const actual = tapDebug.handleResult(info);
    const expected = 'not ok 1\n# ! expected failure';
    strictEqual(actual, expected, acEx(actual, expected));
});
