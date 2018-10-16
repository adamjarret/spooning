function isString(val)
{
    // Thanks https://stackoverflow.com/a/17772086
    return Object.prototype.toString.call(val) === '[object String]';
}

module.exports = isString;