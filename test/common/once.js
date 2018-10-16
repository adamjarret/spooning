function once(fn, context)
{
    // Thanks https://davidwalsh.name/javascript-once
    return function () {
        if (fn) {
            fn.apply(context || this, arguments);
            fn = null;
        }
    };
}

module.exports = once;