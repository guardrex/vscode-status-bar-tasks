### Version History
| Version | Changes Made |
| ------- | ------------ |
| 0.0.1   | Initial Release |
| 0.0.2   | Increased the `OutputChannel` maximum buffer from 200K to 2MB to cover commands with massive output (e.g., `dotnet restore`). |
|         | Added `child_process` module `err` output to `OutputChannel`. |
| 0.0.3   | Reversed `err` addition due to exception with published extension. |
| 0.0.4   | Updated README.md to show multiple `dotnet publish` runtime options. |
| 0.0.5   | Added a plugin to strip JSON comments from the file before parsing to avoid exception if comments are present. |
| 0.0.6   | Reacted to suggestion for regex modification for comment removal. |
| 0.0.7   | Changed the Output Channel from 'Project Task' to 'Tasks' so that command output appears in the existing 'Tasks' panel. |
| 0.0.8   | Added string replacements in arguments for ${workspaceRoot}, ${file}, ${fileBasename}, ${fileDirname}, ${fileExtname}, and ${env.<ENVIRONMENT_VARIABLE_NAME>}. |
| 0.0.9   | Added auto-update of the status bar tasks when the `tasks.json` file is saved. |
| 0.1.0   | Reversed change made in 0.0.7, because there is no way to get a reference to the existing Tasks `OutputChannel` through the VS Code API. Reverted back to using a new `OutputChannel` but changed the name and will use `Status Bar Tasks`. Fixed a counting bug in the code that handles populating the status bar tasks on save of the `tasks.json` file. |
| 0.1.1   | Fixed a bug that prevented using replacement strings more than once in arguments. Added a feature that allows setting `showInStatusBar` to `false` on a task to prevent it from being listed in the status bar tasks provided. Updated the instructions to mention that the extension does not suspend/stop/cancel processes of tasks when they are spawned. Added replacement variables for `${workspaceRootFolderName}` and `${fileBasenameNoExtension}`, and `${relativeFile}`. |
