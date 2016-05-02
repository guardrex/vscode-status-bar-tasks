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
            outputChannel.addOutputChannel('Tasks');
            taskList.forEach((val: Object, i: number) => { 
                let statusBarTask = new StatusBarTask();
                statusBarTask.addStatusBartask(val['taskName'], i);
                let disposableCommand = vscode.commands.registerCommand('extension.run' + i, () => {
                    outputChannel.showOutput();
                    let cmd = val['args'].join(' ');
                    let currentTextEditors = vscode.window.activeTextEditor;
                    let currentFilepath = "", currentFileBasename = "", currentFileDirname = "", currentFileExtname = "";
                    if (currentTextEditors != undefined) {
                        let currentFile = currentTextEditors.document.fileName;
                        let currentFilenameSplit;
                        currentFilepath = currentFile;
                        if (currentFile.indexOf('\\') != -1) {
                            let currentFilepathSplit = currentFile.split('\\');
                            let currentFilename = currentFilepathSplit.pop();
                            currentFilenameSplit = currentFilename.split('.')
                            currentFileDirname = currentFilepathSplit.join('\\');
                        } else {
                            let currentFilepathSplit = currentFile.split('\/');
                            let currentFilename = currentFilepathSplit.pop();
                            currentFilenameSplit = currentFilename.split('.')
                            currentFileDirname = currentFilepathSplit.join('/');
                        }
                        currentFileExtname = currentFilenameSplit.pop();
                        currentFileBasename = currentFilenameSplit;
                    }
                    cmd = cmd.replace(/(\$\{env\.)\w+(\})/gi, function(matched){
                        let envVar = matched.substring(matched.indexOf('.')+1, matched.indexOf('}'));
                        if (process.env[envVar] != undefined) {
                            return process.env[envVar];
                        } else {
                            return "";
                        }
                    });
                    cmd = cmd.replace('${file}', currentFilepath)
                        .replace('${fileBasename}', currentFileBasename)
                        .replace('${fileDirname}', currentFileDirname)
                        .replace('${fileExtname}', currentFileExtname)
                        .replace('${workspaceRoot}', vscode.workspace.rootPath);
                    let ls = exec(cmd, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});
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
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}
