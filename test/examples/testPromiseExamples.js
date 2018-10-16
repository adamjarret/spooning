#!/usr/bin/env node

const {ok, strictEqual} = require('assert');

// Defining tests inside an exported function is not required but can be a useful way of grouping them.
//  The way you define tests is dependent on how you intend to run them.
//  These examples are defined in an dependency-injected function so they can themselves be unit tested.

function defineTests({testPromise, reporter})
{
    const {prefixLines} = reporter.tap;

    // Simple pass

    testPromise('Should pass', () => new Promise((resolve) => {
        ok(true);
        resolve();
    }));

    testPromise('Should pass with message', () => new Promise((resolve) => {
        ok(true);
        resolve('O hi Mark!');
    }));

    testPromise('Should pass with numeric message', () => new Promise((resolve) => {
        ok(true);
        resolve(123);
    }));

    testPromise('Should pass with object message', () => new Promise((resolve) => {
        ok(true);
        resolve({count: 4, total: 8});
    }));

    // Simple fail

    testPromise('Should fail', () => new Promise((resolve) => {
        ok(false);
        resolve();
    }));

    testPromise('Should fail with message', () => new Promise((resolve) => {
        ok(false, 'Example error message');
        resolve();
    }));

    testPromise('Should fail comparison', () => new Promise((resolve) => {
        strictEqual('A', 'B');
        resolve();
    }));

    testPromise('Should fail comparison with message', () => new Promise((resolve) => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        strictEqual(actual, expected, `> ${actual}\n< ${expected}`);
        resolve();
    }));

    testPromise('Should fail comparison with message (without assert A)', () => new Promise((resolve) => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        if (actual !== expected) {
            throw new Error(`> ${actual}\n< ${expected}`);
        }
        resolve();
    }));

    testPromise('Should fail comparison with message (without assert B)', () => new Promise((resolve, reject) => {
        const expected = 'BAABBB';
        const actual = 'BABBAB';
        if (actual !== expected) {
            return reject(new Error(`> ${actual}\n< ${expected}`));
        }
        resolve();
    }));

    testPromise('Should fail comparison with prefixed message', () => new Promise((resolve) => {
        const expected = 'A\nB\nC\n';
        const actual = 'B\nA\nC';
        const msg = `${prefixLines(actual, '> ')}\n---\n${prefixLines(expected, '< ')}`;
        strictEqual(actual, expected, msg);
        resolve();
    }));

    // Async

    testPromise('Should fail nested async operation try/catch', () => new Promise((resolve, reject) => {
        setTimeout(() => {
            // If using assert (or manually throwing errors), errors must be caught within this scope
            //  See next test for example without try/catch
            try {
                ok(false, 'level 1');
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }, 100);
    }));

    testPromise('Should fail nested async operation', () => new Promise((resolve, reject) => {
        setTimeout(() => {
            const expected = true;
            const actual = false;
            return actual !== expected ? reject(new Error('level 1')) : resolve();
        }, 100);
    }));
}

module.exports = defineTests;