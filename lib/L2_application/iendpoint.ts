export default interface IEndpoint {

    callFunction(id: string, ...args: any): Promise<any>;
}
