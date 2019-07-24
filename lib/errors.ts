import * as L2 from './L2_application/errors';
import * as L1 from './L1_transport/errors';
import RemoError from './remoerror';

export { RemoError, L1, L2 };

export function revive(err: any): Error {
    if (err && err.name === "RemoError") {
        // error in our library
        return new RemoError({ label: err.label, code: err.code, text: err.text }, err.details);
    } else {
        // unknown error
        // TODO use class RemoteError for this?
        return new RemoError(L2.UNKNOWN_RPC_ERROR, err);
    }
}
