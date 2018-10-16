#!/usr/bin/env node

const {ok, strictEqual} = require('assert');

// Defining tests inside an exported function is not required but can be a useful way of grouping them.
//  The way you define tests is dependent on how you intend to run them.
//  These examples are defined in an dependency-injected function so they can themselves be unit tested.

function defineTests({testSync, reporter})
{
    const {prefixLines} = reporter.tap;

    // Simple pass

    testSync('Should pass', () => {
        ok(true);
    });

    testSync('Should pass with message', () => {
        return 'O hi Mark!';
    });

    testSync('Should pass with numeric message', () => {
        return 123;
    });

    testSync('Should pass with object message', () => {
        return {count: 4, total: 8};
    });

    // Simple fail

    testSync('Should fail', () => {
        ok(false);
    });

    testSync('Should fail with message', () => {
        ok(false, 'Example error message');
    });

    testSync('Should fail comparison', () => {
        strictEqual('A', 'B');
    });

    testSync('Should fail comparison with message', () => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        strictEqual(actual, expected, `> ${actual}\n< ${expected}`);
    });

    testSync('Should fail comparison with message (without assert)', () => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        if (actual !== expected) {
            throw new Error(`> ${actual}\n< ${expected}`);
        }
    });

    testSync('Should fail comparison with prefixed message', () => {
        const expected = 'A\nB\nC\n';
        const actual = 'B\nA\nC';
        const msg = `${prefixLines(actual, '> ')}\n---\n${prefixLines(expected, '< ')}`;
        strictEqual(actual, expected, msg);
    });
}

module.exports = defineTests;