//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

export const GENERIC               = { label: 'L3_GENERIC',               code: 0xE3000000, text: 'Unknown presentation layer error' };
export const SER_UNKNOWN_CLASS     = { label: 'L3_SER_UNKNOWN_CLASS',     code: 0xE3000001, text: 'Cannot serialize object of unknown class "${classname}"' };
export const DESER_UNKNOWN_CLASS   = { label: 'L3_DESER_UNKNOWN_CLASS',   code: 0xE3000002, text: 'Cannot deserialize object of unknown class "${classname}"' };
export const DESER_UNKNOWN_CONST   = { label: 'L3_DESER_UNKNOWN_CONST',   code: 0xE3000003, text: 'Cannot deserialize unknown constant "${constname}"' };
export const SERIALIZED_BAD_PROP   = { label: 'L3_SERIALIZED_BAD_PROP',   code: 0xE3000004, text: 'Serialized object must have exactly one property' };

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
