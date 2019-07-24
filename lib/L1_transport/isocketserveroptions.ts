//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import * as http from 'http';
import * as https from 'https';

export default interface ISocketServerOptions {
    httpServer: http.Server | https.Server;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
