const {Tap} = require('../common/spooning');

function setOptsFromArgs(testQueue, args)
{
    const {setConcurrency, setBail, reporter: {tap}} = testQueue;

    // Default to running 10 tests in parallel
    setConcurrency(10);

    // Default to Unicode style
    tap.setStyle(Tap.Styles.Unicode);

    args.forEach((arg) => {
        const concurrencyMatch = arg.match(/(-c|--concurrency)=(\d+)/);
        if (concurrencyMatch) {
            setConcurrency(parseInt(concurrencyMatch[2], 10));
        }
        else if (arg === '--bail') {
            setBail(true);
        }
        else if (arg === '--debug') {
            tap.setDebug(true);
        }
        else if (arg === '--basic-style') {
            tap.setStyle(Tap.Styles.Basic);
        }
        else if (arg === '--no-style') {
            tap.setStyle(Tap.Styles.None);
        }
    });
}

module.exports = setOptsFromArgs;