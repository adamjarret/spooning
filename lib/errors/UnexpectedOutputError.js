const acEx = require('../util/acEx');

class UnexpectedOutputError extends Error
{
    constructor(actual, expected, prefix = 'Unexpected output\n')
    {
        super(acEx(actual, expected, prefix));
        this.actual = actual;
        this.expected = expected;
    }
}

module.exports = UnexpectedOutputError;