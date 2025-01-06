import * as assert from 'assert';

describe('Sample task tests', function () {

    before( function() {
    });

    after(() => {
    });

    it('should succeed with simple inputs', function(done: Mocha.Done) {
        assert.equal(1, 1, '1 equals 1');
        done()
    });
});``