code name: secret-octo-wight
=================
Started to implement a task from the guide at https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task
Azure Pipeline variables https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml
Devops API is docs are at https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-request-by-id?view=azure-devops-rest-7.1&tabs=HTTP
Extension: Add PR tabs example https://github.com/microsoft/azure-devops-extension-sample/tree/master/src/Samples/pr-tabs

Ideas for what this task will eventually be able to do:

Goal is to => create a PR quality measurement tool/score
Post to a dashboard, post on each PR? Maybe codebase score is different than PR quality score; points based on actions we want to encourage

- could check for co-authors (pair programming)
- good titles and descriptions get points (audit readyness)
- attached to a devops card could award points (audit readyness)
- could even scan for snyk and award reductions of findings or subtract for adding findings
- how could we check for unit test assertion quality 
- this could be in charge of finding and running unit tests; looking for increase in coverage, or just existence of new tests
- maybe points can also be awarded for non-author actions like constructive comments/conversations
- would be cool to start with points, and then somehow store scores, and give grades on a curve, or show "above average/below  average" flags
- once we score PRs, maybe points get awarded to ICs and we can have some sort of team leaderboards