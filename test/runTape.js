#!/usr/bin/env node

const tape = require('tape');
const spooning = require('./common/spooning');

// Override the push function (and aliases) so calling it defines a new tape test
spooning.push = spooning.test = spooning.it = (name, test) => {
    tape(name, (t) => {
        t.plan(1);
        try {
            test((error) => t.notOk(error));
        }
        catch(e) {
            t.notOk(e);
        }
    });
};

require('./src');
