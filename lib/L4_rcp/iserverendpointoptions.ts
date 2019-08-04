//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import * as L1 from '../L1_transport';

export default interface IServerEndpointOptions extends L1.ISocketServerOptions {

    /** object containing the functions the server should expose */
    api?: any;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
