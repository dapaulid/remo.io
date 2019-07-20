export default class Stopwatch {

    constructor() {
        this.startTime = null;
        this.stopTime = null;
        this.start();
    }

    public start() {
        this.startTime = Stopwatch.now();
        this.stopTime = null;
    }

    public stop(): number {
        if (!this.startTime) {
            return 0;
        }
        this.stopTime = Stopwatch.now();

        return this.elapsedMs();
    }

    public restart(): number {
        const elapsed = this.stop();
        this.start();
        return elapsed;
    }

    public elapsedMs(): number {
        if (!this.startTime) {
            return 0;
        }
        const current = this.stopTime || Stopwatch.now();

        return current.getTime() - this.startTime.getTime();
    }

    public static now(): Date {
        return new Date();
    }

    public startTime: Date | null;
    public stopTime: Date | null;
}
