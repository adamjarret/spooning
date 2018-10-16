const {strictEqual} = require('assert');
const {testSync, acEx} = require('../../common/spooning');

testSync('acEx renders the expected output', () => {
    strictEqual(acEx('A', 'B'), '<<<<<<< actual\nA\n=======\nB\n>>>>>>> expected');
});
