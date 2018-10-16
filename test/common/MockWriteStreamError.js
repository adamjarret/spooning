const MockWriteStream = require('./MockWriteStream');

class MockWriteStreamError extends MockWriteStream
{
    write()
    {
        this.emit('error', new Error('should be caught'));
    }
}

module.exports = MockWriteStreamError;