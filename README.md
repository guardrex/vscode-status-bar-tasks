# vscode-status-bar-tasks
This extension loads your VS Code tasks into executable status bar commands.

![VS Code UI with status bar commands and task execution](/status-bar-tasks.png?raw=true "VS Code UI Example")

### Installation
The extension can be installed via the VS Code Marketplace. If you want to install it manually directly from this repo, take the entire `status-bar-tasks` folder and place it into your user profile `.vscode/extensions` folder. This will make it available to any project you open in VS Code.

### Operation
The extension runs once automatically each time you open a new project folder. If the project has a `.vscode/tasks.json` file, it will load the tasks automatically from that file. If you change the `tasks.json` file, your status bar tasks will update immediately.

### Not recommended for certain background tasks
Once a process is spawned for a task, the extension does nothing to stop or suspend it when the application is closed or VS Code is closed. This extension works best with tasks that run to completion and exit their process when complete on their own. For example, this extension doesn't work well with `dotnet watch`, because that will leave the watch process running after the program or VS Code are closed. There is an open issue to discuss extending the extension to suspend/stop processes that don't end on their own; but as it stands, a feature such as this is beyond the scope of what I intended for this extension to do. https://github.com/GuardRex/vscode-status-bar-tasks/issues/13

### `tasks.json` File Setup
Here is an example `tasks.json` file that contains a number of Gulp and `dotnet cli` commands. The commands will appear in the status bar in the order that they are read from the file.

You may use the following strings in your arguments and they will be replaced with the appropriate values.
- `${workspaceRoot}` the path of the folder opened in VS Code
- `${workspaceRootFolderName}` the last folder on the path of the folder opened in VS Code (e.g., if `${workspaceRoot}` is *c:\_APPS\folder1\folder2*, then `${workspaceRootFolderName}` will return *folder2*)
- `${file}` the current opened file full path and filename with extension
- `${relativeFile}` the filepath to the current opened file relative to the workspace root (e.g., if the `${workspaceRoot}` is *c:\_APPS\folder1\folder2* and the current open file is *c:\_APPS\folder1\folder2\folder3\somefile.txt*, this var will return *folder3\somefile.txt*)
- `${fileBasename}` the current opened file's basename (e.g., if the open file is `c:\_APPS\folder1\.vscode\tasks.json`, this var will return `tasks.json`)
- `${fileBasenameNoExtension}` the current opened file's basename without the extension (e.g., if the open file is `c:\_APPS\folder1\.vscode\tasks.json`, this var will return `tasks`)
- `${fileDirname}` the current opened file's directory (e.g., if the open file is `c:\_APPS\folder1\.vscode\tasks.json`, this var will return `c:\_APPS\folder1\.vscode`)
- `${fileExtname}` the current opened file's extension (e.g., if the open file is `c:\_APPS\folder1\.vscode\tasks.json`, this var will return `.json`)
- `${env.<ENVIRONMENT_VARIABLE_NAME>}` environment variable (e.g., `${env.MY_ENV_VAR}` will be replaced by the value of *MY_ENV_VAR* on the system or an empty string if the environment variable is not set).

Here is a task that you can use with Status Bar Tasks to show all of the variables in action for the current open file:
```json
{
    "taskName": "test variable replacements",
    "suppressTaskName": true,
    "args" : ["echo", "file: ${file} fileBasename: ${fileBasename} relativeFile: ${relativeFile} fileDirname: ${fileDirname} fileExtname: ${fileExtname} workspaceRoot: ${workspaceRoot} fileBasenameNoExtension: ${fileBasenameNoExtension} workspaceRootFolderName: ${workspaceRootFolderName}"],
    "isTestCommand": true,
    "showOutput": "always"
}

```

Note that the `taskName` is only used as the name (due to the presence of `"suppressTaskName": true`), while the `args` contains the command and arguments to be executed.

Note that the schema for the `tasks.json` file is hard-coded into VS Code. Therefore, if you do add `"showInStatusBar": false` to any of the tasks in order to prevent them from being shown in the Status Bar, you will get a warning that the property isn't allowed. This warning should be harmless and not affect VS Code's operation. It will just show up in the UI as a green squiggle under the property. I'm monitoring an issue I opened to hear back from VS Code devs on how to deal with this situation: https://github.com/Microsoft/vscode/issues/17566

```json
{
    "version": "0.1.0",
    "command": "cmd",
    "isShellCommand": true,
    "showOutput": "silent",
    "args": [
        "/c"
    ],
    "tasks": [
        {
            "taskName": "restore",
            "suppressTaskName": true,
            "args" : ["dotnet", "restore"],
            "showOutput": "always",
            "problemMatcher": "$msCompile"
        },
        {
            "taskName": "DO NOT show this task in the Status Bar!",
            "suppressTaskName": true,
            "args" : ["dotnet", "publish", "--configuration", "Release", "--runtime", "win10-x64"],
            "showOutput": "always",
            "isBuildCommand": true,
            "problemMatcher": "$msCompile",
            "showInStatusBar": false
        },
        {
            "taskName": "publish debug 2012R2",
            "suppressTaskName": true,
            "args" : ["dotnet", "publish", "--configuration", "Debug", "--runtime", "win8-x64"],
            "showOutput": "always",
            "isBuildCommand": true,
            "problemMatcher": "$msCompile"
        },
        {
            "taskName": "publish release 2012R2",
            "suppressTaskName": true,
            "args" : ["dotnet", "publish", "--configuration", "Release", "--runtime", "win8-x64"],
            "showOutput": "always",
            "isBuildCommand": true,
            "problemMatcher": "$msCompile"
        },
        {
            "taskName": "publish release Nano",
            "suppressTaskName": true,
            "args" : ["dotnet", "publish", "--configuration", "Release", "--runtime", "win10-x64"],
            "showOutput": "always",
            "isBuildCommand": true,
            "problemMatcher": "$msCompile"
        },
        {
            "taskName": "processcss",
            "suppressTaskName": true,
            "args" : ["gulp", "processCSS"]
        },
        {
            "taskName": "processsjs",
            "suppressTaskName": true,
            "args" : ["gulp", "processJS"],
            "problemMatcher": "$jshint"
        },
        {
            "taskName": "unittest",
            "suppressTaskName": true,
            "args" : ["dotnet", "test"],
            "isTestCommand": true,
            "showOutput": "always"
        },
        {
            "taskName": "dotnet version",
            "suppressTaskName": true,
            "args" : ["dotnet", "--version"],
            "showOutput": "always"
        }
    ]
}
```