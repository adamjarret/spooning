const EventEmitter = require('events');

class MockWriteStream extends EventEmitter
{
    constructor()
    {
        super();

        this.chunks = [];
    }

    write(chunk, callback)
    {
        this.chunks.push(chunk);

        callback && callback();

        return this.highWater();
    }

    highWater()
    {
        return true;
    }

    toString()
    {
        return this.chunks.join('');
    }
}

module.exports = MockWriteStream;