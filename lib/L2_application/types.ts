export interface IFuncDesc {
    id: string;
    name: string;
    params: IParamDesc[];
}

export interface IParamDesc {
    name: string;
}

export type StubFunction = (...args: any[]) => Promise<any>;
