import LinkState from "./linkstate";
import RemoError from "../remoerror";

export default interface ISocket {

    // commands
    connect(): void;
    disconnect(): void;
    send(type: string, message: any): Promise<any>;
    receive(type: string, handler: (message: any) => Promise<any>): void;

    // queries
    getState(): LinkState;

    // callbacks
    onstatechanged: ((state: LinkState, reason: RemoError) => void) | null;
}
