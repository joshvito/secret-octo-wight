import 'dotenv/config';
import tl = require('azure-pipelines-task-lib/task');
import * as PR from './communication/pull-request.js';
import { gradePullRequest } from './services/score.service.js';

async function run() {

    const _devopsMetadata: PR.IDevopsMetadata = {
        teamProjectId: tl.getVariable('System.TeamProjectId')!,
        pullRequestId: Number(tl.getVariable('System.PullRequest.PullRequestId')!),
        repositoryId: tl.getVariable('Build.Repository.ID')!,
        organizationUrl: tl.getVariable('System.TeamFoundationCollectionUri')!,
        token: tl.getInput("PAT")!,  // ToDo: see if we can use the tl.getVariable('SYSTEM.ACCESSTOKEN') in place of PAT
        authorThreshold: Number(tl.getInput('MultipleCommitAuthorsThreshold')!),
    }
    await PR.initGitApi(_devopsMetadata);

    const _commits = await PR.getAuthors(_devopsMetadata);
    const _results = await gradePullRequest(_commits, _devopsMetadata.authorThreshold);

    await PR.addResults(_results, _devopsMetadata);
    tl.setResult(tl.TaskResult.Succeeded, undefined, true);
}
 run();