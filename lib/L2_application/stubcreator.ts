import * as types from './types';

export default class StubCreator {

    public static createDescriptor(id: string, func: Function): types.IFuncDesc {
        return {
            id,
            name: func.name,
            params: this.getParamNames(func).map((name: string) => ({ name })),
        };
    }

    public static createStub(desc: types.IFuncDesc, handler: (id: string, ...args: any) => Promise<any>): types.StubFunction {
        console.log("Creating stub from", desc);
        // create function for wrapping handler function
        const stub: types.StubFunction = (...args) => handler(desc.id, ...args);
        // set function name
        Object.defineProperty(stub, 'name', {
            value: desc.name,
        });
        // set function description
        const paramList = desc.params.map((param: types.IParamDesc) => param.name).join(', ');
        Object.defineProperty(stub, 'toString', {
            value: () => `function ${desc.name}(${paramList}) { [remote code] }`,
        });
        return stub;
    }

    private static getParamNames(func: Function): string[] {
        return func.toString()
            .replace(/[/][/].*$/mg, '') // strip single-line comments
            .replace(/\s+/g, '') // strip white space
            .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
            .split(')', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
            .replace(/=[^,]+/g, '') // strip any ES6 defaults
            .split(',').filter(Boolean); // split & filter [""]
    }
}
