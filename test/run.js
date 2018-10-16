#!/usr/bin/env node

const testQueue = require('./common/spooning');
const setOptsFromArgs = require('./common/setOptsFromArgs');

require('./src');

setOptsFromArgs(testQueue, process.argv.slice(2));

testQueue.run(testQueue.exit);
