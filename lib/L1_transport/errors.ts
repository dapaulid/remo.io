//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

export const GENERIC               = { label: 'L1_GENERIC',               code: 0xE1000000, text: 'Unknown transport layer error' };
export const ENCODE_FAILED         = { label: 'L1_ENCODE_FAILED',         code: 0xE1000001, text: 'Encoding a message failed' };
export const DECODE_FAILED         = { label: 'L1_DECODE_FAILED',         code: 0xE1000002, text: 'Decoding a message failed' };
export const CODEC_NO_BINARY       = { label: 'L1_CODEC_NO_BINARY',       code: 0xE1000003, text: 'Codec does not support binary data' };
export const FRAME_ID_COLLISION    = { label: 'L1_FRAME_ID_COLLISION',    code: 0xE1000004, text: 'A frame with the same ID is already pending' };
export const COMM_TIMEOUT          = { label: 'L1_COMM_TIMEOUT'      ,    code: 0xE1000005, text: 'Communication timeout' };
export const RAW_SOCKET_NULL       = { label: 'L1_RAW_SOCKET_NULL',       code: 0xE1000006, text: 'Raw socket does not exist' };

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
