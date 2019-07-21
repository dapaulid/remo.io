import LinkState from "./linkstate";
import RemoError from "../remoerror";

export default interface ISocket {

    // commands
    connect(): void;
    disconnect(): void;
    send(message: any): Promise<void>;

    // queries
    getState(): LinkState;
    canConnect(): boolean;

    // callbacks
    onmessage: ((message: any) => void) | null;
    onstatechanged: ((state: LinkState, reason: RemoError) => void) | null;
}
