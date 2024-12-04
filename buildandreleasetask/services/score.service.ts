import { PagedList } from 'azure-devops-node-api/interfaces/common/VSSInterfaces.js';
import { GitCommitRef } from 'azure-devops-node-api/interfaces/GitInterfaces.js';

export interface IScoreResult {
    commitAuthors: string[];
    points: number;
    grade?: string;
    pointStr?: string;
}

export async function gradePullRequest(commits: PagedList<GitCommitRef>, authorThreshold = 2): Promise<IScoreResult> {

    let _init: IScoreResult = {
        commitAuthors: [],
        points: 0
    };
    let result = commits
        .map((commitRef) => commitRef.author?.name)
        .filter((author) => author !== undefined)
        .reduce((accum, author) => {
            if (!accum.commitAuthors.includes(author!)) {
                accum.commitAuthors.push(author!);
            }
            return accum;
        }, _init);

    result.grade = result.commitAuthors.length >= authorThreshold ? `A` : `F`; // ToDo: how to calculate the grade?
    result.pointStr = result.commitAuthors.length >= authorThreshold ? `+1 :sparkles:` : `0`;

    return result;
}