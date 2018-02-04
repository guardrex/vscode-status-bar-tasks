/**
 * Task helper class.
 * 
 * See:
 * https://code.visualstudio.com/docs/editor/tasks -- examples
 * https://code.visualstudio.com/docs/editor/tasks-appendix -- task interface reference
 */
class Task {
    /**
     * Original config.
     */
    config: Object;

    isWindows: boolean;

    /**
     * Constructor.
     * 
     * @param taskConfig Original configuration of the task in `tasks.json`.
     * @param platform Platform (system).
     *     For Windows something starting with `win` is expected.
     *     For Linux something starting with `lin` is expected.
     *     Otherwise treated as Mac OS.
     */
    constructor(taskConfig: Object, platform: string) {
        this.config = Object.assign({}, taskConfig);    // clone

        // apply platform-specifc configuration
        let platformName = 'windows';
        if (!platform.startsWith('win')) {
            if (platform.startsWith('lin')) {
                platformName = 'linux';
            } else {
                platformName = 'osx';
            }
        }
        if (typeof this.config[platformName] === 'object') {
            Object.assign(this.config, this.config[platformName]);
        }
    }

    /**
     * Wheater the task should be shown in a status bar.
     * 
     * For now this does not validate the task.
     */
    showInStatusBar():boolean {
        return this.config['showInStatusBar'] == undefined || this.config['showInStatusBar'] == true;
    }

    /**
     * Get label of the task (short description).
     */
    getLabel():string {
        let label = this.config['label'] || this.config['taskName'] || "";
        // automatic label
        if (label.length < 1) {
            label = this.config['type'];
            // e.g. gulp: build
            if (this.config['task']) {
                label += `: ${this.config['task']}`;
            }
        }
        return label;
    }
    
    /**
     * Get command to be run.
     */
    getCommand(globalCommandArguments:string):string {
        let cmd = '';
        switch (this.config['type']) {
            case 'gulp':
                cmd = `gulp ${this.config['task']}`;
            break;
            case 'shell':
                if (typeof this.config['command'] === 'string') {
                    cmd = this.config['command'];
                } else {
                    cmd = globalCommandArguments;
                }
                if (Array.isArray(this.config['args'])) {
                    cmd += ' ' + this.config['args'].join(' ');
                }
            break;
        }
        return cmd;
    }
}

export { Task };