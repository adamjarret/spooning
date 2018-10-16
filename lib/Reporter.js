class Reporter
{
    constructor(tap, stream)
    {
        this.write = (text, callback) => {
            try {
                this.stream.write(!text || !text.length ? '' : text + this.tap.EOL, callback);
            }
            catch (error) {
                callback(error);
            }
        };

        this.tap = tap;
        this.stream = stream;
    }

    runStart(info, callback)
    {
        this.write(this.tap.handleStart(info), callback);
    }

    runEnd(info, callback)
    {
        this.write(this.tap.handleEnd(info), callback);
    }

    testResult(info, callback)
    {
        this.write(this.tap.handleResult(info), callback);
    }
}

module.exports = Reporter;