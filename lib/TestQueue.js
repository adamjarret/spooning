const EventEmitter = require('events');
const queue = require('async/queue');
const noop = (info, callback) => callback();

class TestQueue extends EventEmitter
{
    constructor(reporter, options)
    {
        super();

        this.push = this.test = this.it = this._push.bind(this);

        this.pushSync = this.testSync = this._pushSync.bind(this);

        this.pushPromise = this.testPromise = this.swear = this._pushPromise.bind(this);

        this.run = this._run.bind(this);

        this.exit = this._exit.bind(this);

        this.setAutoRun = (isEnabled) => isEnabled ? this.q.resume() : this.q.pause();

        this.setBail = (isEnabled) => this.bail = !!isEnabled;

        this.setConcurrency = (n) => this.q.concurrency = (n ? n : 1);

        // Init

        const {concurrency, autoRun, bail} = options || {};
        this.process = process; // allow dependency injection
        this.reporter = reporter || {runStart: noop, runEnd: noop, testResult: noop};
        this.passed = 0;
        this.lastIdx = 0;
        this.q = queue(this._qItemHandler.bind(this), concurrency || 1);
        this.q.drain = this._qDrain();
        this.setAutoRun(autoRun);
        this.setBail(bail);
    }

    _push(name, test, callback)
    {
        this.q.push({name, test}, callback);
    }

    _pushSync(name, test, callback)
    {
        this.push(name, (cb) => cb(null, test()), callback);
    }

    _pushPromise(name, test, callback)
    {
        this.push(name, (cb) => test().then(cb.bind(null, null), cb), callback);
    }

    _run(callback = null)
    {
        const count = this.q.length();
        const info = {count};

        if (callback) {
            this.q.drain = this._qDrain(callback);
        }

        this.reporter.runStart(info, (writeError) => {

            this.emit('runStart', info);

            writeError && this.emit('error', writeError);

            if (count > 0) {
                this.q.resume();
            }
            else {
                this.q.drain();
            }
        });
    }

    _exit(error, info)
    {
        // handle any reporter error encountered
        if (error) { this.emit('error', error); }

        this.process.exit(info.exitCode);
    }

    _qDrain(callback)
    {
        return () => {
            const {reporter, lastIdx, passed} = this;
            const exitCode = (passed === lastIdx ? 0 : 1);
            const info = {total: lastIdx, passed, exitCode};

            // Write footer diagnostic message and callback
            reporter.runEnd(info, (writeError) => {

                this.emit('runEnd', info);

                callback && callback(writeError, info);
            });
        };
    }

    _qItemHandler({name, test}, callback)
    {
        const reportAndCallback = (error, diagnosticMessage) => {

            if (!error) {
                // Increment counter for tests that pass
                this.passed++;
            }

            // Write result message and callback
            const info = {idx: ++this.lastIdx, name, error, diagnosticMessage};
            this.reporter.testResult(info, (writeError) => {

                this.emit('testResult', info);

                if(writeError) {
                    this.emit('error', writeError);
                }

                // Note: writeError is not considered when determining whether to bail.
                //  This is because the error is emitted above so, if it is unhandled,
                //  the queue effectively "bails" when the error is thrown.
                //  If the error is handled, then the handler should determine whether or not to bail
                //  (testQueue._kill() can be called by the handler).
                return this._maybeBail(error, info, callback);
            });
        };

        try {
            test(reportAndCallback);
        }
        catch (e) {
            reportAndCallback(e);
        }
    }

    _kill(error, info, callback)
    {
        // This kill implementation differs from async.queue.kill in that the drain callback is still called
        //  and there is an opportunity for one final callback before draining.
        const drain = this.q.drain;
        this.q.kill();
        callback && callback(error, info);
        drain();
    }

    _maybeBail(error, info, callback)
    {
        // If bail is true, remove remaining tests from queue and end run
        if (error && this.bail) {
            this._kill(error, info, callback);
        } else {
            callback(error, info);
        }
    }
}

module.exports = TestQueue;
