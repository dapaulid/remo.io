//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

type SerializedValue = SerializedItem | SerializedItem[];
type SerializedItem = Primitive | ISerializedObject;
type Primitive = boolean | string | number | null;

interface ISerializedObject {
    [typename: string]: SerializedValue;
}

interface ISerializer {
    serialize(value: any): any;
    deserialize(serialized: any): any;
}

import * as errors from './errors';
import RemoError from '../remoerror';

function isRefType(v: any): v is ISerializedObject {
    return (typeof v === 'object' || typeof v === 'function') && v !== null;
}

function isArray(v: any): v is any[] {
    return Array.isArray(v);
}

export default class Serializer {

    constructor () {
        this.handler = new Map();
        this.constToValue = new Map();
        this.valueToConst = new Map();

        // register handlers
        this.addHandler("Object", {
            serialize: (obj: any) => {
                const serialized: any = {};
                for (const key of Object.keys(obj)) {
                    serialized[key] = this.serialize(obj[key]);
                }
                return serialized;
            }, deserialize: (serialized: any) => {
                const obj: any = {};
                for (const key of Object.keys(serialized)) {
                    obj[key] = this.deserialize(serialized[key]);
                }
                return obj;
            },
        });

        this.addHandler("Date", {
            serialize: (date: Date) => {
                return date.toJSON();
            }, deserialize: (serialized: any) => {
                return new Date(serialized !== null ? serialized : "invalid");
            },
        });

        // add special values as constants
        this.addConst("NaN", NaN);
        this.addConst("Infinity", Infinity);
        this.addConst("-Infinity", -Infinity);
        this.addConst("undefined", undefined);
    }

    public serialize(value: any): SerializedValue {
        // handle constants (NaN, Infinity, undefined, ...)
        const constname = this.valueToConst.get(value);
        if (constname) {
            return { const: constname };
        }
        if (isRefType(value)) {
            // handle object
            if (isArray(value)) {
                return value.map(this.serialize, this) as SerializedValue;
            } else {
                const ctorname = value.constructor.name;
                const handler = this.handler.get(ctorname);
                if (!handler) {
                    throw new RemoError(errors.SER_UNKNOWN_CLASS, { classname: ctorname });
                }
                return {
                    [ctorname]: handler.serialize(value),
                };
            }
        } else {
            // handle primitive
            return value;
        }
    }

    public deserialize(serialized: SerializedValue): any {
        if (isRefType(serialized)) {
            // handle object
            if (isArray(serialized)) {
                return serialized.map(this.deserialize, this);
            } else {
                const keys = Object.keys(serialized);
                if (keys.length !== 1) {
                    throw new RemoError(errors.SERIALIZED_BAD_PROP);
                }
                const typename = keys[0];
                const value = serialized[typename];
                // handle constants (NaN, Infinity, undefined, ...)
                if (typename === 'const' && typeof value === 'string') {
                    const constvalue = this.constToValue.get(value);
                    if (!constvalue && this.valueToConst.get(constvalue) !== value) {
                        throw new RemoError(errors.DESER_UNKNOWN_CONST, { constname: value });
                    }
                    return constvalue;
                }
                const handler = this.handler.get(typename);
                if (!handler) {
                    throw new RemoError(errors.DESER_UNKNOWN_CLASS, { classname: typename });
                }
                return handler.deserialize(value);
            }
        } else {
            // handle primitive
            return serialized;
        }
    }

    public addHandler(name: string, serializer: ISerializer) {
        this.handler.set(name, serializer);
    }

    protected addConst(name: string, value: any) {
        this.constToValue.set(name, value);
        this.valueToConst.set(value, name);
    }

    protected handler: Map<string, ISerializer>;
    protected constToValue: Map<string, any>;
    protected valueToConst: Map<any, string>;

}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
