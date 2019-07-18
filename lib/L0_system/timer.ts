export default class Timer {

    constructor(interval: number, callback: VoidFunction) {
        this.interval = interval;
        this.callback = callback;
        this.handle = null;
    }

    public start() {
        if (!this.handle) {
            this.handle = setTimeout(this.callback, this.interval);
        }
    }

    public stop() {
        if (this.handle) {
            clearTimeout(this.handle);
            this.handle = null;
        }
    }

    public restart() {
        this.stop();
        this.start();
    }

    private interval: number;
    private callback: VoidFunction;
    private handle: NodeJS.Timeout | null;
}
