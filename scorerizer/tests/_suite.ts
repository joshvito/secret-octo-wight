import 'dotenv/config';
import * as scorer from '../services/score.service.js';
import { IDevopsMetadata } from '../communication/pull-request.js';
import tl = require('azure-pipelines-task-lib');
import * as assert from 'assert';

describe('Smoke test tests', function () {
    it('should succeed with simple inputs', function(done: Mocha.Done) {
        assert.equal(1, 1, '1 equals 1');
        done()
    });
});

describe('Local development env variables set', () => {
    // don't run these tests in the pipeline
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    const _env: IDevopsMetadata = {
            teamProjectId: tl.getVariable('System.TeamProjectId')!,
            pullRequestId: Number(tl.getVariable('System.PullRequest.PullRequestId')!),
            repositoryId: tl.getVariable('Build.Repository.ID')!,
            organizationUrl: tl.getVariable('System.TeamFoundationCollectionUri')!,
            token: tl.getVariable('SYSTEM.ACCESSTOKEN') || tl.getInput("PAT")!,
            authorThreshold: Number(tl.getInput('MultipleCommitAuthorsThreshold')!),
            pairProgrammingEnabled: tl.getBoolInput('EncouragePairProgramming')!,
        }
        it('should have a value for the environment variable System.TeamProjectId', () => {
            assert.ok(_env.teamProjectId);
        });
        it('should have a value for the environment variable System.PullRequest.PullRequestId', () => {
            assert.ok(_env.pullRequestId);
        });
        it('should have a value for the environment variable Build.Repository.ID', () => {
            assert.ok(_env.repositoryId);
        });
        it('should have a value for the environment variable System.TeamFoundationCollectionUri', () => {
            assert.ok(_env.organizationUrl);
        });
        it('should have a value for the environment variable PAT', () => {
            assert.ok(_env.token);
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