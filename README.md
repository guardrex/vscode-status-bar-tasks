# vscode-status-bar-tasks
This extension loads your VS Code tasks into executable status bar commands.

![VS Code UI with status bar commands and task execution](/status-bar-tasks.png?raw=true "VS Code UI Example")

### Installation
The extension can be installed via the VS Code Marketplace. If you want to install it manually directly from this repo, take the entire *status-bar-tasks* folder and place it into your user profile *.vscode/extensions* folder. This will make it available to any project you open in VS Code.

### Operation
The extension runs once automatically each time you open a new project folder. If the project has a *vscode/tasks.json* file, it will load the tasks automatically from that file. If you change the *tasks.json* file, your status bar tasks will update as soon as you save the file.

### Not recommended for certain background tasks
Once a process is spawned for a task, the extension does nothing to stop or suspend it when the application is closed or VS Code is closed. This extension works best with tasks that run to completion and exit their process when complete on their own. For example, this extension doesn't work well with `dotnet watch`, because that will leave the watch process running after the program or VS Code are closed.

### *tasks.json* File Setup
Here is an example *tasks.json* file that contains a number of Gulp and `dotnet cli` commands. The commands will appear in the status bar in the order that they are read from the file.

You may use the following strings in your arguments and they will be replaced with the appropriate values.
- `${workspaceRoot}` the path of the folder opened in VS Code
- `${workspaceRootFolderName}` the last folder on the path of the folder opened in VS Code (e.g., if `${workspaceRoot}` is *c:\_APPS\folder1\folder2*, then `${workspaceRootFolderName}` will return *folder2*)
- `${file}` the current opened file full path and filename with extension
- `${relativeFile}` the filepath to the current opened file relative to the workspace root (e.g., if the `${workspaceRoot}` is *c:\_APPS\folder1\folder2* and the current open file is *c:\_APPS\folder1\folder2\folder3\somefile.txt*, this var will return *folder3\somefile.txt*)
- `${fileBasename}` the current opened file's basename (e.g., if the open file is *c:\_APPS\folder1\.vscode\tasks.json*, this var will return *tasks.json*)
- `${fileBasenameNoExtension}` the current opened file's basename without the extension (e.g., if the open file is *c:\_APPS\folder1\.vscode\tasks.json*, this var will return *tasks*)
- `${fileDirname}` the current opened file's directory (e.g., if the open file is *c:\_APPS\folder1\.vscode\tasks.json*, this var will return *c:\_APPS\folder1\.vscode*)
- `${fileExtname}` the current opened file's extension (e.g., if the open file is *c:\_APPS\folder1\.vscode\tasks.json*, this var will return *.json*)
- `${env.<ENVIRONMENT_VARIABLE_NAME>}` environment variable (e.g., `${env.MY_ENV_VAR}` will be replaced by the value of *MY_ENV_VAR* on the system or an empty string if the environment variable is not set).

Here is a task that you can use with Status Bar Tasks to show all of the variables in action for the current open file:
```json
{
    "label": "test variable replacements",
    "command": "echo",
    "args" : ["file: ${file} fileBasename: ${fileBasename} relativeFile: ${relativeFile} fileDirname: ${fileDirname} fileExtname: ${fileExtname} workspaceRoot: ${workspaceRoot} fileBasenameNoExtension: ${fileBasenameNoExtension} workspaceRootFolderName: ${workspaceRootFolderName}"]
}
```

As of VS Code 1.9, there is a new `command` property that you can have on each task. If you don't supply this property on a task, then the global `command` property and `args` property are used (`cmd /c` in the example below). If you do supply a task with a `command` property, the global property is *not* used and the `command` on the task along with the task's `<args>` are used to assemble the command.

For the example *tasks.json* file below, `restore example 1` yields a command execution of:
```
dotnet restore
```
The task `restore example 2` yields a command execution of:
```
cmd /c dotnet restore
```

Note that the schema for the *tasks.json* file is hard-coded into VS Code right now. Therefore, if you do add `"showInStatusBar": false` to any of the tasks in order to prevent them from being shown in the Status Bar, you'll get a warning that the property isn't allowed. This warning should be harmless and not affect VS Code's operation. It'll just show up in the UI as a green squiggle under the property. I'm monitoring an open issue that should fix the problem with adding properties to the *task.json* schema. If you agree that they should offer this feature, you can go to the issue and click the :+1: on the main post to vote your support for the feature: https://github.com/Microsoft/vscode/issues/20193

```json
{
    "version": "2.0.0",
    "command": "cmd",
    "args": [
        "/c"
    ],
    "tasks": [
        {
            "type": "shell",
            "label": "restore example 1",
            "command": "dotnet restore"
        },
        {
            "type": "shell",
            "label": "restore example 2",
            "args" : ["dotnet", "restore"]
        },
        {
            "type": "shell",
            "label": "build",
            "command" : "dotnet build --configuration Debug",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": "$msCompile"
        },
        {
            "type": "shell",
            "label": "DO NOT show this task in the Status Bar!",
            "command": "dotnet publish --configuration Release --runtime win10-x64",
            "problemMatcher": "$msCompile",
            "showInStatusBar": false
        },
        {
            "type": "shell",
            "label": "process css",
            "command": "gulp processCSS"
        },
        {
            "type": "shell",
            "label": "test",
            "command": "dotnet test",
            "args" : ["test"]
        },
        {
            "type": "shell",
            "label": "dotnet info",
            "command": "dotnet --info"
        }
    ]
}
```
### Version History
Version | Changes Made
------- | ------------
0.0.1   | Initial Release
0.0.2   | Increased the `OutputChannel` maximum buffer from 200K to 2MB to cover commands with massive output (e.g., `dotnet restore`). Added `child_process` module `err` output to `OutputChannel`.
0.0.3   | Reversed `err` addition due to exception with published extension.
0.0.4   | Updated README.md to show multiple `dotnet publish` runtime options.
0.0.5   | Added a plugin to strip JSON comments from the file before parsing to avoid exception if comments are present.
0.0.6   | Reacted to suggestion for regex modification for comment removal.
0.0.7   | Changed the Output Channel from 'Project Task' to 'Tasks' so that command output appears in the existing 'Tasks' panel.
0.0.8   | Added string replacements in arguments for ${workspaceRoot}, ${file}, ${fileBasename}, ${fileDirname}, ${fileExtname}, and ${env.<ENVIRONMENT_VARIABLE_NAME>}.
0.0.9   | Added auto-update of the status bar tasks when the *tasks.json* file is saved.
0.1.0   | Reversed change made in 0.0.7, because there is no way to get a reference to the existing Tasks `OutputChannel` through the VS Code API. Reverted back to using a new `OutputChannel` but changed the name and will use `Status Bar Tasks`. Fixed a counting bug in the code that handles populating the status bar tasks on save of the *tasks.json* file.
0.1.1   | Fixed a bug that prevented using replacement strings more than once in arguments. Added a feature that allows setting `showInStatusBar` to `false` on a task to prevent it from being listed in the status bar tasks provided. Updated the instructions to mention that the extension does not suspend/stop/cancel processes of tasks when they are spawned. Added replacement variables for `${workspaceRootFolderName}` and `${fileBasenameNoExtension}`, and `${relativeFile}`.
0.1.2   | Updated README file
0.2.0   | *BREAKING CHANGE:* Reacted to new VS Code 1.9 feature for *tasks.json* where each task can have a `command` that overides the global `command`. With this version of Status Bar Tasks, the global `command` and `args` are prefixed to the task arguments unless the new task `command` property is found.
0.2.1   | React to https://github.com/GuardRex/vscode-status-bar-tasks/issues/23 so that ${workspaceRoot} and ${workspaceRootFolderName} are populated when no project is open.
0.3.0   | Use `label` to provide task names. `taskName` is still supported by the extension, but VS Code has depreciated `taskName` in favor of `label`.
