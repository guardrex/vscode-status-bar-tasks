# vscode-status-bar-tasks
This extension loads your VS Code tasks into executable status bar commands.

![VS Code UI with status bar commands and task execution](/status-bar-tasks.png?raw=true "VS Code UI Example")

### Installation
The extension can be installed via the VS Code Marketplace. If you want to install it manually directly from this repo, take the entire `status-bar-tasks` folder and place it into your user profile `.vscode/extensions` folder. This will make it available to any project you open in VS Code.

### Operation
The extension runs once automatically each time you open a new project folder. If the project has a `.vscode/tasks.json` file, it will load the tasks automatically from that file. If you change the `tasks.json` file, either close the project and re-open it or close VS Code and re-run it for the extension to pickup the changes.

### `tasks.json` File Setup
Here is an example `tasks.json` file that contains a number of Gulp and `dotnet cli` commands. The commands will appear in the status bar in the order that they are read from the file.

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
0.0.2   | Increased the `OutputChannel` maximum buffer from 200K to 2MB to cover commands with massive output (e.g., `dotnet restore`)
        | Added `child_process` module `err` output to `OutputChannel`
0.0.3   | Reversed `err` addition due to exception with published extension.
0.0.4   | Updated README.md to show multiple `dotnet publish` runtime options
0.0.5   | Added a plugin to strip JSON comments from the file before parsing to avoid exception if comments are present
0.0.6   | React to suggestion for regex modification for comment removal