
# PR Scorerizer 
**Code name**: secret-octo-wight

## Requirements
The pipeline needs to explicitly map `System.AccessToken` into the pipeline using a variable. See MS [docs](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml#systemaccesstoken);


## Contributing
If you want to contribute, and need to run locally, there is a fallback option to use a `PAT` from your environment variables in place of the `SYSTEM.ACCESSTOKEN`. 

Just put a `.env` file at the root of `./scorerizer` directory with the inputs you need to run. 
DO NOT commit the .env file to source control. The system variable get read at runtime from the pipeline, so you will need to supply them when running locally. 

Given the following devops url: https://dev.azure.com/mycompany/myproject

e.g.
```
// .env
INPUT_PAT="YOUR_GENERATED_PAT_FOR_DEVOPS"
System_PullRequest_PullRequestId=1234567890
System_TeamProjectId="myproject"
System_TeamFoundationCollectionUri="https://dev.azure.com/mycompany/"
Build_Repository_ID="00000000-0000-0000-0000-000000000000"
```
Also, if your env contains the `NODE_ENV` variable, and it is set to "development", the unit tests will check that the above env values are set.

### Ideas/Future Considerations

Goal is to => create a PR quality measurement tool/score
Post to a dashboard, post on each PR? Maybe codebase score is different than PR quality score; points based on actions we want to encourage

- [DONE] ~~could check for co-authors (pair programming)~~
- good titles and descriptions get points (audit readyness)
- attached to a devops card could award points (audit readyness)
- could even scan for snyk and award reductions of findings or subtract for adding findings
- how could we check for unit test assertion quality 
- this could be in charge of finding and running unit tests; looking for increase in coverage, or just existence of new tests
- maybe points can also be awarded for non-author actions like constructive comments/conversations
- would be cool to start with points, and then somehow store scores, and give grades on a curve, or show "above average/below  average" flags
- once we score PRs, maybe points get awarded to ICs and we can have some sort of team leaderboards

## References
- Started to implement a task from the [extensions guide](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task)
- Azure Pipeline variables [docs](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml)
- Devops API [docs](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-request-by-id?view=azure-devops-rest-7.1&tabs=HTTP)
- Extension: Add PR tabs [example](https://github.com/microsoft/azure-devops-extension-sample/tree/master/src/Samples/pr-tabs)
