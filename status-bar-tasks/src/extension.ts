'use strict';
import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
const exec = require('child_process').exec;

export function activate(context: vscode.ExtensionContext) {
    var taskList;
    var statusBarTask;
    var disposableCommand;
    var outputChannel;
    if (vscode.workspace && vscode.workspace.rootPath) {
        let taskList = getTasksArray();
        if (!taskList) {
            vscode.window.showInformationMessage('Status Bar Tasks: There are no tasks to load.');
        } else {
            let outputChannel = new OutputChannel;
            outputChannel.addOutputChannel('Project Task');
            taskList.forEach(function (val, i) { 
                let statusBarTask = new StatusBarTask();
                statusBarTask.addStatusBartask(val['taskName'], i);
                let disposableCommand = vscode.commands.registerCommand('extension.run' + i, () => {
                    outputChannel.showOutput();
                    let ls = exec(val['args'].join(' '), {cwd: vscode.workspace.rootPath});
                    ls.stdout.on('data', function (data) {
                        outputChannel.attachOutput(data);
                    });
                    ls.stderr.on('data', function (data) {
                        outputChannel.attachOutput(data);
                    });
                });
                context.subscriptions.push(disposableCommand);
                context.subscriptions.push(statusBarTask);
            });
        }
    }
    context.subscriptions.push(outputChannel);
}

export function deactivate() {
}

function getTasksArray() : Array<Object> {
    let tasksFilePath = path.join(vscode.workspace.rootPath, '.vscode', 'tasks.json');
    try {
        let taskFileTasks = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));
        if (taskFileTasks) {
            let taskElement = taskFileTasks['tasks'];
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
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}
