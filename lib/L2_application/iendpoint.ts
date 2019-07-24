//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

export default interface IEndpoint {

    callFunction(id: string, ...args: any): Promise<any>;

    registerFunction(id: string, func: Function): void;
    unregisterFunction(id: string): boolean;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
