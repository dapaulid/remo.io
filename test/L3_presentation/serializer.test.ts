import { expect, assert } from 'chai';
import Serializer from '../../lib/L3_presentation/serializer';
import * as errors from '../../lib/errors';

const ser = new Serializer();

function testSerDeser(value: any, expected: any) {

    // serialize value
    const serialized = ser.serialize(value);

    // serialized value must match expected format
    assert.deepEqual(serialized, expected,
        "actual serialized value differs from expected value");

    // serialized value must be formatted as JSON without loss of information
    assert.deepEqual(serialized, JSON.parse(JSON.stringify(serialized)),
        "loss of information when converting to/from JSON");

    // deserialize value
    const deserialized = ser.deserialize(serialized);

    // deserialized value must match original value
    assert.deepEqual(deserialized, value,
        "deserialized value differs from original value");
}

function expectRemoError(call: Function, error: { label: string } ) {
    expect(call).to.throw(errors.RemoError).with.property('label', error.label);
}

describe('Serializer', () => {

    describe('primitives', () => {
        it('should handle positive numbers', () => {
            testSerDeser(1234.5678, 1234.5678);
        });
        it('should handle negative numbers', () => {
            testSerDeser(-1234.5678, -1234.5678);
        });
        it('should handle zero', () => {
            testSerDeser(0, 0);
        });
        it('should handle strings', () => {
            testSerDeser("hello", "hello");
        });
        it('should handle empty strings', () => {
            testSerDeser("", "");
        });
    });

    describe('objects', () => {
        it('should handle objects', () => {
            testSerDeser({ foo: 1 }, { Object: { foo: 1 } });
        });
        it('should handle nested objects', () => {
            testSerDeser({ foo: { bar: 2} }, { Object: { foo: { Object: { bar: 2 } } } });
        });
        it('should handle empty objects', () => {
            testSerDeser({}, { Object: {} });
        });
    });

    describe('arrays', () => {
        it('should handle arrays', () => {
            testSerDeser([1, 2, 3, 4], [1, 2, 3, 4]);
        });
        it('should handle arrays with objects', () => {
            testSerDeser([{ foo: 1 }, { bar: 2 }], [{ Object: { foo: 1 } }, { Object: { bar: 2 } }]);
        });
        it('should handle empty arrays', () => {
            testSerDeser([], []);
        });
    });

    describe('dates', () => {
        it('should handle dates', () => {
            testSerDeser(new Date('2019-08-22T18:34:14.844Z'), { Date: '2019-08-22T18:34:14.844Z' });
        });
        it('should handle invalid dates', () => {
            testSerDeser(new Date('foo'), { Date: null });
        });
    });

    describe('special values', () => {
        it('should handle null', () => {
            testSerDeser(null, null);
        });
        it('should handle undefined', () => {
            testSerDeser(undefined, { const: "undefined" });
        });
        it('should handle Infinity', () => {
            testSerDeser(Infinity, { const: "Infinity" });
        });
        it('should handle -Infinity', () => {
            testSerDeser(-Infinity, { const: "-Infinity" });
        });
        it('should handle NaN', () => {
            testSerDeser(NaN, { const: "NaN" });
        });
    });

    describe('bad cases', () => {
        it('should throw when serializing unknown classes', () => {
            class Foo {}
            expectRemoError(() => ser.serialize(new Foo()), errors.L3.SER_UNKNOWN_CLASS);
        });

        it('should throw when deserializing unknown classes', () => {
            expectRemoError(() => ser.deserialize({ Foo: {} }), errors.L3.DESER_UNKNOWN_CLASS);
        });
        it('should throw when deserializing unknown constants', () => {
            expectRemoError(() => ser.deserialize({ const: "foo" }), errors.L3.DESER_UNKNOWN_CONST);
        });
        it('should throw when deserializing objects with multiple properties', () => {
            expectRemoError(() => ser.deserialize({ object: { foo: 1 }, bar: 2}), errors.L3.SERIALIZED_BAD_PROP);
        });
    });
});
