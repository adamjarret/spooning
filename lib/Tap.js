const maybeStringify = require('./util/maybeStringify');
const Styles = require('./TapStyles');

class Tap
{
    constructor(style, debug = false, EOL = '\n')
    {
        this.lineReducer = (prefix) => (s, line) => `${s.length ? s + this.EOL : ''}${prefix}${line}`;

        this.prefixLines = (text, prefix) => text.split(/\r?\n/).reduce(this.lineReducer(prefix), '');

        this.setStyle = (style) => Object.assign(this.style, Tap.Styles.None, style || {});

        this.setDebug = (isEnabled) => this.debug = isEnabled;

        this.setEOL = (eol) => this.EOL = eol;

        this.nl = (s) => s.replace('\n', this.EOL);

        // Init

        this.style = {};
        this.setStyle(style);
        this.setDebug(debug);
        this.setEOL(EOL);
    }

    renderPlan(count)
    {
        const {nl, style: {Plan, Reset}} = this;

        return nl(Plan) + (!count || count < 1 ? '0..0' : `1..${count}`) + Reset;
    }

    renderResult(ok, idx, name = '', suffix = '')
    {
        const {nl, EOL} = this;
        const {Ok, NotOk, Idx, Name, Reset} = this.style;
        const prefix = ok ? nl(Ok) : `${nl(NotOk)}not `;
        const displayName = !name || !name.length ? '' : ` - ${nl(Name)}${name}${Reset}`;
        const displaySuffix = !suffix || !suffix.length ? '' : `${EOL}${suffix}`;

        return `${prefix}ok${Reset} ${nl(Idx)}${idx}${Reset}${displayName}${displaySuffix}`;
    }

    renderDiagnostic(message, prefix = '# ')
    {
        const {Log, Reset} = this.style;
        const text = Tap.messageToString(message);

        return !text || !text.length ? '' : `${this.nl(Log)}${this.prefixLines(text, prefix)}${Reset}`;
    }

    handleStart({count})
    {
        return this.renderPlan(count);
    }

    handleEnd({total, passed})
    {
        return this.renderDiagnostic(`test: ${total}${this.EOL}pass: ${passed}${this.EOL}fail: ${total - passed}`);
    }

    handleResult({idx, name, error, diagnosticMessage})
    {
        // Pre-render diagnostic message for atomic write (instead of calling this.diagnostic separately)
        const output = diagnosticMessage ? [this.renderDiagnostic(diagnosticMessage)] : [];

        if (error && error.stack && this.debug) {
            // Append error stack if defined and debug is truthy (includes error message)
            output.push(this.renderDiagnostic(error.stack, '# ! '));
        }
        else if (error) {
            // Append error message
            output.push(this.renderDiagnostic(error.message || error, '# ! '));
        }

        return this.renderResult(!error, idx, name, output.join(this.EOL));
    }
}

Tap.messageToString = maybeStringify;

Tap.Styles = Styles;

module.exports = Tap;
