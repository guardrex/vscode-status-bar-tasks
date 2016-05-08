# vscode-status-bar-tasks
This extension loads your VS Code tasks into executable status bar commands.

![VS Code UI with status bar commands and task execution](/status-bar-tasks.png?raw=true "VS Code UI Example")

### Installation
The extension can be installed via the VS Code Marketplace. If you want to install it manually directly from this repo, take the entire `status-bar-tasks` folder and place it into your user profile `.vscode/extensions` folder. This will make it available to any project you open in VS Code.

### Operation
The extension runs once automatically each time you open a new project folder. If the project has a `.vscode/tasks.json` file, it will load the tasks automatically from that file. If you change the `tasks.json` file, your status bar tasks will update immediately.

### `tasks.json` File Setup
Here is an example `tasks.json` file that contains a number of Gulp and `dotnet cli` commands. The commands will appear in the status bar in the order that they are read from the file.

You may use the following strings in your arguments and they will be replaced with the appropriate values.
- ${workspaceRoot} the path of the folder opened in VS Code
- ${file} the current opened file
- ${fileBasename} the current opened file's basename
- ${fileDirname} the current opened file's directory
- ${fileExtname} the current opened file's extension
- ${env.<ENVIRONMENT_VARIABLE_NAME>} environment variable (e.g., ${env.MY_ENV_VAR} will be replaced by the value of MY_ENV_VAR on the system or an empty string if the environment variable is not set).

Note that the `taskName` is only used as the name (due to the presence of `"suppressTaskName": true`), while the `args` contains the command and arguments to be executed.

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
            "taskName": "watch",
            "suppressTaskName": true,
            "args" : ["gulp", "watch"]
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
### Version History
Version | Changes Made
------- | ------------
0.0.1   | Initial Release
0.0.2   | Increased the `OutputChannel` maximum buffer from 200K to 2MB to cover commands with massive output (e.g., `dotnet restore`).
        | Added `child_process` module `err` output to `OutputChannel`.
0.0.3   | Reversed `err` addition due to exception with published extension.
0.0.4   | Updated README.md to show multiple `dotnet publish` runtime options.
0.0.5   | Added a plugin to strip JSON comments from the file before parsing to avoid exception if comments are present.
0.0.6   | Reacted to suggestion for regex modification for comment removal.
0.0.7   | Changed the Output Channel from 'Project Task' to 'Tasks' so that command output appears in the existing 'Tasks' panel.
0.0.8   | Added string replacements in arguments for ${workspaceRoot}, ${file}, ${fileBasename}, ${fileDirname}, ${fileExtname}, and ${env.<ENVIRONMENT_VARIABLE_NAME>}.
0.0.9   | Added auto-update of the status bar tasks when the `tasks.json` file is saved.
0.1.0   | Reversed change made in 0.0.7, because there is no way to get a reference to the existing Tasks `OutputChannel` through the VS Code API. Reverted back to using a new `OutputChannel` but changed the name and will use `Status Bar Tasks`. Fixed a counting bug in the code that handles populating the status bar tasks on save of the `tasks.json` file.