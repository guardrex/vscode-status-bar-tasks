# vscode-status-bar-tasks
This extension loads your VS Code tasks into executable status bar commands.

![VS Code UI with status bar commands and task execution](/status-bar-tasks.png?raw=true "VS Code UI Example")

## WARNING!
This extension is at the **PROTOTYPE** stage! Use at your own risk.

### Requirements
- VS Code
- Tolerance of hacky-screwball programming

### Installation
There is no installer for the extension (yet). Take the entire `status-bar-tasks` folder and place it into your user profile `.vscode/extensions` folder. This will make it available to any project you open in VS Code. Shortly, the project will be turned into a package and submitted to the VS Code Marketplace, where I plan to charge $500 per download and retire to Barbados, where I'll sip fine beers on the beech.

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
            "taskName": "publish debug",
            "suppressTaskName": true,
            "args" : ["dotnet", "publish", "--configuration", "Debug"],
            "showOutput": "always",
            "isBuildCommand": true,
            "problemMatcher": "$msCompile"
        },
        {
            "taskName": "publish release",
            "suppressTaskName": true,
            "args" : ["dotnet", "publish", "--configuration", "Release"],
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


