import * as azdev from 'azure-devops-node-api';
import { IGitApi } from 'azure-devops-node-api/GitApi.js';
import { Comment, CommentThreadStatus, CommentType, GitCommitRef, GitPullRequestCommentThread } from 'azure-devops-node-api/interfaces/GitInterfaces.js';
import { IScoreResult } from '../services/score.service.js';
import { PagedList } from 'azure-devops-node-api/interfaces/common/VSSInterfaces.js';
import { WebApiTagDefinition, WebApiCreateTagRequestData } from 'azure-devops-node-api/interfaces/CoreInterfaces.js';

export interface IDevopsMetadata {
    teamProjectId: string;
    pullRequestId: number;
    repositoryId: string;
    organizationUrl: string;
    token: string;
    authorThreshold: number;
}

let gitApi: IGitApi;

export async function initGitApi(meta: IDevopsMetadata): Promise<IGitApi> {
    const authHandler = azdev.getPersonalAccessTokenHandler(meta.token); 
    const connection = new azdev.WebApi(meta.organizationUrl, authHandler);    
    gitApi = await connection.getGitApi();
    return gitApi;
}

export async function getAuthors(meta: IDevopsMetadata): Promise<PagedList<GitCommitRef>> {
    const pullreq = await gitApi.getPullRequestById(meta.pullRequestId, meta.teamProjectId);
    const commits = await gitApi.getPullRequestCommits(pullreq.repository?.id!, meta.pullRequestId, meta.teamProjectId);
    return commits;
}

export async function addResults(score: IScoreResult, meta: IDevopsMetadata): Promise<GitPullRequestCommentThread> {
    if(score.commitAuthors.length >= meta.authorThreshold) {
        await createPullRequestLabel('MultipleCommitAuthors', meta);
    }
    return await createThread(score, meta);
}

async function createPullRequestLabel(name: string, meta: IDevopsMetadata): Promise<WebApiTagDefinition> {
    const labelRequest: WebApiCreateTagRequestData = {name};
    let result: Promise<WebApiTagDefinition>;
    try {
        await gitApi.createPullRequestLabel(labelRequest, meta.repositoryId, meta.pullRequestId, undefined, meta.teamProjectId);
    } catch (error) {
        debugger;
    }
    return undefined as any;
}

async function createThread(score: IScoreResult, meta: IDevopsMetadata): Promise<GitPullRequestCommentThread> {

    const _comment: Comment  = {
        content: `**PR Grade**: ${score.grade}\r\n|Coder|Points|\r\n|-|-|\r\n|${score.commitAuthors.join('| '+score.pointStr +'|\r\n')}|${score.pointStr}|`,
        commentType: CommentType.System
    };
    const _thread: GitPullRequestCommentThread = {
        comments: [_comment],
        identities: {}, // ToDo: add the robot identity or similar
        status: CommentThreadStatus.Active
    };

    return await gitApi.createThread(_thread, meta.repositoryId, meta.pullRequestId, meta.teamProjectId);
}