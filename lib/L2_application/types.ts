//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

export interface IFuncDesc {
    id: string;
    params: IParamDesc[];
}

export interface IParamDesc {
    name: string;
}

export type StubFunction = (...args: any[]) => Promise<any>;

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
