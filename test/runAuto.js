#!/usr/bin/env node

const testQueue = require('./common/spooning');
const setOptsFromArgs = require('./common/setOptsFromArgs');

testQueue.on('runEnd', ({exitCode}) => process.exit(exitCode)).setAutoRun(true);

setOptsFromArgs(testQueue, process.argv.slice(2));

require('./src');
