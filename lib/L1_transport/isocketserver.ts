//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import ISocket from './isocket';

export default interface ISocketServer {

    // commands

    // callbacks
    onconnected: ((socket: ISocket) => void) | null;
    ondisconnected: ((socket: ISocket) => void) | null;

    shutdown(): void;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
