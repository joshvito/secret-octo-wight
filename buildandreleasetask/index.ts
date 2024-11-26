import 'dotenv/config';
import tl = require('azure-pipelines-task-lib/task');
import * as azdev from 'azure-devops-node-api';
import { Comment, CommentThreadStatus, CommentType, GitPullRequestCommentThread } from 'azure-devops-node-api/interfaces/GitInterfaces.js';

interface IResult {
    commitAuthors: string[];
    points: number;
}

let _init: IResult = {
    commitAuthors: [],
    points: 0
};

async function run() {
    const orgUrl = tl.getVariable('System.TeamFoundationCollectionUri')!;

    // ToDo: see if we can use the tl.getVariable('SYSTEM.ACCESSTOKEN') in place of PAT
    const token: string = tl.getInput("PAT")!;
    const authHandler = azdev.getPersonalAccessTokenHandler(token); 
    const connection = new azdev.WebApi(orgUrl, authHandler);    
    const gitApi = await connection.getGitApi();
    const _teamProjectId: string = tl.getVariable('System.TeamProjectId')!;
    const _pullRequestId: number = Number(tl.getVariable('System.PullRequest.PullRequestId')!);
    const _repositoryId: string = tl.getVariable('Build.Repository.ID')!;
    const _authorThreshold: number = Number(tl.getInput('MultipleCommitAuthorsThreshold')!) || 2;

    const pullreq = await gitApi.getPullRequestById(_pullRequestId, _teamProjectId);
    const commits = await gitApi.getPullRequestCommits(pullreq.repository?.id!, _pullRequestId, _teamProjectId);

    let _results: IResult = commits
        .map((commitRef) => commitRef.author?.name)
        .filter((author) => author !== undefined)
        .reduce((accum, author) => {
            if (!accum.commitAuthors.includes(author!)) {
                accum.commitAuthors.push(author!);
            }
            return accum;
        }, _init);

    const _comment: Comment  = {
        content: `This pull request has commits from multiple authors: ${_results.commitAuthors.join(', ')}`,
        commentType: CommentType.System
    };
    const _thread: GitPullRequestCommentThread = {
        comments: [_comment],
        identities: {}, // ToDo: add the robot identity or similar
        status: CommentThreadStatus.Active
    };
    // debugger;
    
    if (_results.commitAuthors.length >= _authorThreshold) {
        await gitApi.createPullRequestLabel({name: 'MultipleCommitAuthors'}, _repositoryId, _pullRequestId, undefined, _teamProjectId);
        await gitApi.createThread(_thread, _repositoryId, _pullRequestId, _teamProjectId);
        tl.setResult(tl.TaskResult.Succeeded, 'Multiple commit authors detected', true);
        return;
    }
}

 run();