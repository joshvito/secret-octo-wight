import * as assert from 'assert';
import * as scorer from '../services/score.service.js';

describe('Sample task tests', function () {

    before( function() {
    });

    after(() => {
    });

    it('should succeed with simple inputs', function(done: Mocha.Done) {
        assert.equal(1, 1, '1 equals 1');
        done()
    });
});

describe('Score Service Tests', () => {
    it('single code authors should RESULT in F grade', async () => {
        const _expected = 'F';
        const commits = [{author: {name: 'Luke Skywacker'}},{author: {name: 'Luke Skywacker'}}];
        const result = await scorer.gradePullRequest(commits);
        assert.equal(result.grade, _expected);
        assert.equal(result.commitAuthors.length > 1, false)
    });
    it('multiple code authors should RESULT in A grade', async () => {
        const _expected = 'A';
        const commits = [{author: {name: 'Luke Skywacker'}}, {author: {name: 'Darth T`Mater'}}];
        const result = await scorer.gradePullRequest(commits);
        assert.equal(result.grade, _expected);
        assert.equal(result.commitAuthors.length > 1, true)
    });
});