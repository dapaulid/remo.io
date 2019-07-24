//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
