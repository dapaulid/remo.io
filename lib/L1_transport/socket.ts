export default interface ISocket {
    connect(): void;
    disconnect(): void;
    send(message: any): void;
}
