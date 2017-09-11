'use strict';
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
var cmdCounter = 0;
var statusBarItems: Array<vscode.StatusBarItem> = [];
var globalCommandArguments = "";

export function activate(context: vscode.ExtensionContext) {
    if (vscode.workspace && vscode.workspace.rootPath) {
        var tasksOutputChannel = new OutputChannel;
        tasksOutputChannel.addOutputChannel('Status Bar Tasks');
        var saveContext = vscode.workspace.onDidSaveTextDocument((textDocument : vscode.TextDocument) => {
            if (textDocument.fileName.endsWith('tasks.json')) {
                statusBarItems.forEach((i: vscode.StatusBarItem) => {
                    i.hide();
                });
                statusBarItems = [];
                LoadTasks(context, tasksOutputChannel);
            }
        });
        context.subscriptions.push(saveContext);
        LoadTasks(context, tasksOutputChannel);
    }
}

function LoadTasks(context: vscode.ExtensionContext, tasksOutputChannel: OutputChannel) {
    /*
    tasksOutputChannel.attachOutput('Start loading of tasks:\n');
    vscode.commands.getCommands(true).then(results => {
        results.forEach((val: string, i: number) => {
            if (val.startsWith('extension.run')) {
                tasksOutputChannel.attachOutput( i + ' ' + val + '\n');
            }
        });
        tasksOutputChannel.attachOutput('cmdCounter: ' + cmdCounter + ' Loading tasks now.\n');
    });
    */

    var statusBarTask, disposableCommand;
    const taskList = getTasksArray();
    var taskCounter = 0;
    var delimiter = process.platform == 'win32' ? '\\' : '/';
    var cmd = "";
    if (taskList) {
        taskList.forEach((val: Object, i: number) => { 
            let statusBarTask = new StatusBarTask();
            if (val['showInStatusBar'] == undefined || val['showInStatusBar'] == true)
            {
                let statusBarLabel = val['statusBarLabel'] || val['label'] || val['taskName'];
                statusBarTask.addStatusBartask(statusBarLabel, (i + cmdCounter));
                let disposableCommand = vscode.commands.registerCommand('extension.run' + (i + cmdCounter), () => {
                    tasksOutputChannel.showOutput();
                    if (val['command'] != undefined)
                    {
                        if (val['args'] != undefined)
                        {
                            cmd = val['command'] + ' ' + val['args'].join(' ');
                        } else {
                            cmd = val['command'];
                        }
                    } else {
                        if (val['args'] != undefined)
                        {
                            cmd = globalCommandArguments + ' ' + val['args'].join(' ');
                        } else {
                            cmd = globalCommandArguments;
                        }
                    }
                    let currentTextEditors = vscode.window.activeTextEditor;
                    let sbt_workspaceRoot = '', sbt_workspaceRootFolderName = '', sbt_file = '', sbt_relativeFile = '', sbt_fileDirname = '', sbt_fileBasename = '', sbt_fileBasenameNoExtension = '', sbt_fileExtname;

                    // path to the current application
                    sbt_workspaceRoot = vscode.workspace.rootPath;

                    // folder name holding the application
                    sbt_workspaceRootFolderName = sbt_workspaceRoot.substring(sbt_workspaceRoot.lastIndexOf(delimiter)+1);

                    if (currentTextEditors != undefined) {
                        try
                        {
                            // full filepath to open file
                            sbt_file = vscode.window.activeTextEditor.document.fileName;

                            // folder/file relative to the workspace root
                            sbt_relativeFile = sbt_file.substring(sbt_workspaceRoot.length+1);

                            let currentFilepathSplit = sbt_file.split(delimiter);

                            // filename
                            sbt_fileBasename = currentFilepathSplit.pop();

                            // path to the open file
                            sbt_fileDirname = currentFilepathSplit.join(delimiter);

                            // file extension 
                            let sbt_fileExtnameArray = sbt_fileBasename.match('(\\.[^.]+)$');
                            sbt_fileExtname = sbt_fileExtnameArray != null ? sbt_fileExtnameArray[0] : '';

                            // filename without extension
                            sbt_fileBasenameNoExtension = sbt_fileBasename.substring(0, sbt_fileBasename.length - sbt_fileExtname.length);
                        }
                        catch (e)
                        {
                            tasksOutputChannel.attachOutput('Exception during string variable replacements: ' + e);
                        }
                    }
                    cmd = cmd.replace(/(\$\{env\.)\w+(\})/gi, function(matched){
                        let envVar = matched.substring(matched.indexOf('.')+1, matched.indexOf('}'));
                        if (process.env[envVar] != undefined) {
                            return process.env[envVar];
                        } else {
                            return "";
                        }
                    });

                    cmd = cmd.replace(/\$\{file\}/gi, sbt_file)
                        .replace(/\$\{fileBasename\}/gi, sbt_fileBasename)
                        .replace(/\$\{relativeFile\}/gi, sbt_relativeFile)
                        .replace(/\$\{fileDirname\}/gi, sbt_fileDirname)
                        .replace(/\$\{fileExtname\}/gi, sbt_fileExtname)
                        .replace(/\$\{workspaceRoot\}/gi, sbt_workspaceRoot)
                        .replace(/\$\{fileBasenameNoExtension\}/gi, sbt_fileBasenameNoExtension)
                        .replace(/\$\{workspaceRootFolderName\}/gi, sbt_workspaceRootFolderName);

                    let ls = exec(cmd, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});
                    ls.stdout.on('data', data => tasksOutputChannel.attachOutput(data));
                    ls.stderr.on('data', data => tasksOutputChannel.attachOutput(data));
                });
            }
            context.subscriptions.push(disposableCommand);
            context.subscriptions.push(statusBarTask);
            taskCounter += 1;
        });
        cmdCounter += taskCounter;
    }
    /*
    tasksOutputChannel.attachOutput('Post loading of tasks:\n');
    vscode.commands.getCommands(true).then(results => {
        results.forEach((val: string, i: number) => {
            if (val.startsWith('extension.run')) {
                tasksOutputChannel.attachOutput( i + ' ' + val + '\n');
            }
        });
        tasksOutputChannel.attachOutput('cmdCounter: ' + cmdCounter + '\n');
        tasksOutputChannel.attachOutput('\n');
    });
    */
}

export function deactivate() {
}

function getTasksArray() : Array<Object> {
    try {
        const taskFilePath = path.join(vscode.workspace.rootPath, '.vscode', 'tasks.json');
        const rawTaskFileContents = fs.readFileSync(taskFilePath, 'utf8');
        var taskFileContents = rawTaskFileContents.replace(/((\/\/|\/\/\/)(.*)(\r\n|\r|\n))|((\/\*)((\D|\d)+)(\*\/))/gi, "");
        const taskFileTasks = JSON.parse(taskFileContents);
        if (taskFileTasks) {
            if (taskFileTasks['command'] != undefined)
            {
                globalCommandArguments = taskFileTasks['command']
            }
            if (taskFileTasks['args'] != undefined)
            {
                globalCommandArguments += ' ' + taskFileTasks['args'].join(' ');
            }
            let taskElement = taskFileTasks['tasks'];
            /*
            if (taskFileTasks.command) {
                var command = taskFileTasks.command;
                if (taskFileTasks.args) {
                    var args = taskFileTasks.args;
                    taskElement.forEach(function(task) {
                        if (task.args) {
                            task.args.splice(0, 0, command);
                            task.args.splice.apply(task.args, [1,0].concat(args));
                        } else {
                            task.args.push(command);
                            task.args.push(args);
                        }
                    });
                }
            }
            */
            return taskElement;
        } else {
            return null;
        }
    } catch (e) {
        return null;	
    }	
}

class OutputChannel {

    private _outputChannel: vscode.OutputChannel;

    public addOutputChannel(channelName: string) : void {
        this._outputChannel = vscode.window.createOutputChannel(channelName);
    }
    
    public attachOutput(output: any) {
        this._outputChannel.append(output);
    }
    
    public showOutput() {
        this._outputChannel.show();
    }

    dispose() {
        this._outputChannel.dispose();
    }
}

class StatusBarTask {

    private _statusBarItem: vscode.StatusBarItem;

    public addStatusBartask(taskName: string, taskNumber: number) : void {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this._statusBarItem.text = taskName;
        this._statusBarItem.command = "extension.run" + taskNumber;
        this._statusBarItem.show();
        statusBarItems.push(this._statusBarItem);
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}
