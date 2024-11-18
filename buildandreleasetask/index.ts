import 'dotenv/config';
import tl = require('azure-pipelines-task-lib/task');
import { Buffer } from 'node:buffer';

 async function run() {
    // https://dev.azure.com/campuslabs/CollegiateLink/_git/Pillar.SisIntegration/pullrequest/38751
    const encode = (str: string):string => Buffer.from(':'+ str).toString('base64');

    const url = `https://dev.azure.com/${process.env.debug_organization}/${process.env.debug_project}/_apis/git/pullrequests/${process.env.debug_pullRequestId}?api-version=7.1`;

    const tryandsee = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encode(process.env.pat_devops || '')}`
        }
    });
     
    const response = await tryandsee.json();


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