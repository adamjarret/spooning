const emoji = (code) => String.fromCodePoint(parseInt(code, 16));

// Character Constants

const SpoonIcon = emoji('0x1F944');
const CheckIcon = '\u2714';
const CrossIcon = '\u2718';

const Reset = '\x1b[0m';
const Bold = '\x1b[1m';
const Dim = '\x1b[2m';
const Underline = '\x1b[4m';

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';

// Styles

const None = {
    Plan: '',   // "N..N" text
    Ok: '',     // "ok" text
    NotOk: '',  // "not ok" text
    Idx: '',    // test number (determined by order finished)
    Name: '',   // test name
    Log: '',    // diagnostic messages
    Reset: ''   // reset formatting
};

const Basic = {
    Plan: Underline,
    Ok: `${FgGreen}${Bold}`,
    NotOk: `${FgRed}${Bold}`,
    Log: Dim,
    Reset
};

const Unicode = Object.assign({}, Basic, {
    Plan: `${SpoonIcon}\n${Basic.Plan}`, // '\n' will be replaced with set EOL when the style is rendered
    Ok: `${Basic.Ok}${CheckIcon}${Reset}${Bold} `,
    NotOk: `${Basic.NotOk}${CrossIcon}${Reset}${Bold} `
});

module.exports = {
    None,
    Basic,
    Unicode,
    $: {
        emoji,
        Icons: {SpoonIcon, CheckIcon, CrossIcon},
        EscapeCodes: {Reset, Bold, Dim, Underline, FgRed, FgGreen}
    }
};