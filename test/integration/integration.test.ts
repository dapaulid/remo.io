import * as testserver from './testserver';

import * as remo from '../../lib';

import { expect, assert } from 'chai';

const server = testserver.run(3000);

describe('integration', () => {
    it('should call an echo function', async () => {
        console.log("before connect");
        const remote = await remo.createClient().connect("http://localhost:3000");
        console.log("after connect");
        expect(await remote.getApi().echo(1234)).to.equal(1234);
        console.log("after expect");
        server.shutdown();
        remote.shutdown();
    });
});
