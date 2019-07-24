//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

 enum LinkState {
    DISCONNECTED  = "DISCONNECTED",
    CONNECTING    = "CONNECTING",
    CONNECTED     = "CONNECTED",
    DISCONNECTING = "DISCONNECTING",
    LINKDOWN      = "LINKDOWN",
    RECONNECTING  = "RECONNECTING",
}

 export default LinkState;

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
