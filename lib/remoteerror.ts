// error class used for generic errors occurred on a remote host
export default class RemoteError extends Error {

    constructor(message: string, details?: any) {
        // call base
        super(message);
        // set properties
        this.name = "RemoteError";
        this.details = details;
    }

    public details: any;
}
