const isString = require('./isString');

function maybeStringify(val, indent = 2)
{
    return isString(val) ? val : JSON.stringify(val, null, indent);
}

module.exports = maybeStringify;