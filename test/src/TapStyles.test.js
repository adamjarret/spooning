const {strictEqual} = require('assert');
const {testSync, Tap} = require('../common/spooning');

const tap = new Tap(Tap.Styles.Basic);

testSync('Tap should render styled plan (count: 0)', () => {
    strictEqual(tap.renderPlan(0), '\x1b[4m0..0\x1b[0m');
});

testSync('Tap should render styled plan (count: 4)', () => {
    strictEqual(tap.renderPlan(4), '\x1b[4m1..4\x1b[0m');
});

testSync('Tap should render styled result (ok)', () => {
    strictEqual(tap.renderResult(true, 1), '\x1b[32m\x1b[1mok\x1b[0m 1\x1b[0m');
});

testSync('Tap should render styled result (not ok)', () => {
    strictEqual(tap.renderResult(false, 1), '\x1b[31m\x1b[1mnot ok\x1b[0m 1\x1b[0m');
});

testSync('Tap should render styled result (empty message)', () => {
    strictEqual(tap.renderResult(true, 1, ''), '\x1b[32m\x1b[1mok\x1b[0m 1\x1b[0m');
});

testSync('Tap should render styled result (message)', () => {
    const expected = '\x1b[32m\x1b[1mok\x1b[0m 1\x1b[0m - Test message\x1b[0m';
    strictEqual(tap.renderResult(true, 1, 'Test message'), expected);
});

testSync('Tap should render styled diagnostic', () => {
    strictEqual(tap.renderDiagnostic('Test message'), '\x1b[2m# Test message\x1b[0m');
});

testSync('Tap should render styled multi-line diagnostic', () => {
    const expected = '\x1b[2m# Test message\n# Second line\n# Third line\x1b[0m';
    strictEqual(tap.renderDiagnostic('Test message\nSecond line\nThird line'), expected);
});

testSync('Tap should render styled multi-line diagnostic with prefix', () => {
    const expected = '\x1b[2m# ! Test message\n# ! Second line\n# ! Third line\x1b[0m';
    strictEqual(tap.renderDiagnostic('Test message\nSecond line\nThird line', '# ! '), expected);
});
