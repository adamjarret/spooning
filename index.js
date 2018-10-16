const Reporter = require('./lib/Reporter');
const Tap = require('./lib/Tap');
const TestQueue = require('./lib/TestQueue');

// Shared instance
module.exports = new TestQueue(new Reporter(new Tap(), process.stdout));

// Classes
module.exports.Reporter = Reporter;
module.exports.Tap = Tap;
module.exports.TestQueue = TestQueue;

// Error types
module.exports.UnexpectedOutputError = require('./lib/errors/UnexpectedOutputError');

// Utilities
module.exports.acEx = require('./lib/util/acEx');
module.exports.isString = require('./lib/util/isString');
module.exports.maybeStringify = require('./lib/util/maybeStringify');

// External (for convenience)
module.exports.async = require('async');
