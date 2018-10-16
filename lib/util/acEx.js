const stringify = require('./maybeStringify');

function acEx(actual, expected, prefix = '')
{
    return `${prefix}<<<<<<< actual\n${stringify(actual)}\n=======\n${stringify(expected)}\n>>>>>>> expected`;
}

module.exports = acEx;