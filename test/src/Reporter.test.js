const {it, Reporter, Tap, UnexpectedOutputError} = require('../common/spooning');
const MockWriteStream = require('../common/MockWriteStream');

function stubReporter()
{
    return new Reporter(new Tap(), new MockWriteStream());
}

it('Reporter should handle writing undefined value', (callback) => {

    const reporter = stubReporter();

    reporter.write(undefined, () => {

        const error = new UnexpectedOutputError(reporter.stream.toString(), '');
        callback(error.actual === error.expected ? null : error);
    });
});

it('Reporter should report start', (callback) => {

    const reporter = stubReporter();

    reporter.runStart({count: 1}, () => {

        const error = new UnexpectedOutputError(reporter.stream.toString(), '1..1\n');
        callback(error.actual === error.expected ? null : error);
    });
});

it('Reporter should report end', (callback) => {

    const reporter = stubReporter();

    reporter.runEnd({total: 1, passed: 0}, () => {

        const error = new UnexpectedOutputError(reporter.stream.toString(), '# test: 1\n# pass: 0\n# fail: 1\n');
        callback(error.actual === error.expected ? null : error);
    });
});

it('Reporter should report testResult', (callback) => {

    const reporter = stubReporter();

    reporter.testResult({idx: 1}, () => {

        const error = new UnexpectedOutputError(reporter.stream.toString(), 'ok 1\n');
        callback(error.actual === error.expected ? null : error);
    });
});
