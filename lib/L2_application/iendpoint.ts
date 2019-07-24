export default interface IEndpoint {

    callFunction(id: string, ...args: any): Promise<any>;

    registerFunction(id: string, func: Function): void;
    unregisterFunction(id: string): boolean;
}
