#!/usr/bin/env node

const {ok, strictEqual} = require('assert');

// Defining tests inside an exported function is not required but can be a useful way of grouping them.
//  The way you define tests is dependent on how you intend to run them.
//  These examples are defined in an dependency-injected function so they can themselves be unit tested.

function defineTests({test, reporter})
{
    const {prefixLines} = reporter.tap;

    // Simple pass

    test('Should pass with message', (callback) => {
        ok(true);
        callback(null, 'O hi Mark!');
    });

    test('Should pass with numeric message', (callback) => {
        ok(true);
        callback(null, 123);
    });

    test('Should pass with object message', (callback) => {
        ok(true);
        callback(null, {count: 4, total: 8});
    });

    // Simple fail

    test('Should fail with message', (callback) => {
        ok(false, 'Example error message');
        callback();
    });

    test('Should fail comparison with message', (callback) => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        strictEqual(actual, expected, `> ${actual}\n< ${expected}`);
        callback();
    });

    test('Should fail comparison with message (without assert A)', (callback) => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        if (actual !== expected) {
            throw new Error(`> ${actual}\n< ${expected}`);
        }
        callback();
    });

    test('Should fail comparison with message (without assert B)', (callback) => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        callback(actual === expected ? null : new Error(`> ${actual}\n< ${expected}`));
    });

    test('Should fail comparison with prefixed message', (callback) => {
        const expected = 'A\nB\nC\n';
        const actual = 'B\nA\nC';
        const msg = `${prefixLines(actual, '> ')}\n---\n${prefixLines(expected, '< ')}`;
        strictEqual(actual, expected, msg);
        callback();
    });

    // Async

    test('Should fail nested async operation try/catch', (callback) => {
        setTimeout(() => {
            // If using assert (or manually throwing errors), errors must be caught within this scope
            //  See next test for equivalent callback example
            try {
                ok(false, 'level 1');
                callback();
            }
            catch (e) {
                callback(e);
            }
        }, 100);
    });

    test('Should fail nested async operation callback', (callback) => {
        setTimeout(() => {
            const expected = true;
            const actual = false;
            callback(actual === expected ? null : new Error('level 1'));
        }, 100);
    });
}

module.exports = defineTests;