import 'dotenv/config';
import tl = require('azure-pipelines-task-lib/task');
import * as azdev from 'azure-devops-node-api';

 async function run() {
    const orgUrl = `https://dev.azure.com/${process.env.debug_organization}`;
    const token: string = process.env.pat_devops || '';
    const authHandler = azdev.getPersonalAccessTokenHandler(token); 
    const connection = new azdev.WebApi(orgUrl, authHandler);    
    const gitApi = await connection.getGitApi();

    let pr = await gitApi.getPullRequestById(Number(process.env.debug_pullRequestId), process.env.debug_project)

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