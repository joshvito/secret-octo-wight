import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import ma = require('azure-pipelines-task-lib/mock-answer');

const __dirname = path.resolve(path.dirname(''));
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('samplestring', 'human');

tmr.run();