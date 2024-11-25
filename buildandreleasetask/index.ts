import 'dotenv/config';
import tl = require('azure-pipelines-task-lib/task');
import * as azdev from 'azure-devops-node-api';

async function run() {
    const orgUrl = tl.getVariable('System.TeamFoundationCollectionUri')!;
    const token: string = tl.getInput("PAT")!;
    const authHandler = azdev.getPersonalAccessTokenHandler(token); 
    const connection = new azdev.WebApi(orgUrl, authHandler);    
    const gitApi = await connection.getGitApi();
    const _teamProjectId: string = tl.getVariable('System.TeamProjectId')!;
    const _pullRequestId: string = tl.getVariable('System.PullRequest.PullRequestId')!;

    let pr = await gitApi.getPullRequestById(Number(_pullRequestId), _teamProjectId)
    debugger;
    
    // hello world below
    try {
        const inputString: string | undefined = tl.getInput('samplestring', true);
        if (inputString == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        console.log('Hello', inputString);
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

 run();