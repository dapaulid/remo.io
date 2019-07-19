import LinkState from "./linkstate";

export default interface ISocket {

    // commands
    connect(): void;
    disconnect(): void;
    send(message: any): Promise<void>;

    // queries
    getState(): LinkState;

    // callbacks
    onmessage: ((message: any) => void) | null;
    onstatechanged: ((state: LinkState) => void) | null;
}
