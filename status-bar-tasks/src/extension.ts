'use strict';
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

export function activate(context: vscode.ExtensionContext) {
    var statusBarTask, disposableCommand;
    if (vscode.workspace && vscode.workspace.rootPath) {
        const taskList = getTasksArray();
        if (!taskList) {
            vscode.window.showInformationMessage('Status Bar Tasks: There are no tasks to load.');
        } else {
            const outputChannel = new OutputChannel;
            outputChannel.addOutputChannel('Project Task');
            taskList.forEach((val: Object, i: number) => { 
                let statusBarTask = new StatusBarTask();
                statusBarTask.addStatusBartask(val['taskName'], i);
                let disposableCommand = vscode.commands.registerCommand('extension.run' + i, () => {
                    outputChannel.showOutput();
                    let ls = exec(val['args'].join(' '), {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});
                    ls.stdout.on('data', data => outputChannel.attachOutput(data));
                    ls.stderr.on('data', data => outputChannel.attachOutput(data));
                });
                context.subscriptions.push(disposableCommand);
                context.subscriptions.push(statusBarTask);
            });
            context.subscriptions.push(outputChannel);
        }
    }
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
