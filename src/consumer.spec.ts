import {Consumer} from "./consumer";
import * as path from "path";
import {Interaction, Pact} from "@pact-foundation/pact";
import {eachLike, like} from "@pact-foundation/pact/src/dsl/matchers";
import {number} from "@pact-foundation/pact/src/v3/matchers";


describe('The Consumer API', () => {
    const url = 'http://127.0.0.1';
    let consumer: Consumer;

    const provider = new Pact({
        // port,
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        spec: 2,
        consumer: 'Consumer',
        provider: 'Provider',
    });

    const userExample = {id:1, name: 'Max', password: 'secret'};
    const EXPECTED_BODY = like(userExample);
    const expBody = {
        id: number(23),
        name: like('h'),
        password: like('p')
    }

    beforeAll(() =>
        provider.setup().then((opts) => {
            consumer = new Consumer({url, port: opts.port});
        })
    );

    afterAll(() => provider.finalize());

    afterEach(() => provider.verify());

    describe('get /user?:id', () => {
        beforeAll(() => {
            const interaction = new Interaction()
                .given('I have a list of users')
                .uponReceiving('a request for a user with specific id')
                .withRequest({
                    method: 'GET',
                    path: '/user',
                    headers: {
                        Accept: 'application/json',
                    },
                    query: {
                        id: '1'
                    },
                })
                .willRespondWith({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: EXPECTED_BODY,
                });

            return provider.addInteraction(interaction);
        });

        // This test uses raw AxiosPromise and it not type-safe
    /*    it('returns the correct response', (done) => {
            consumer.getUser(1).then((response: any) => {
                expect(response.data[0]).toStrictEqual(userExample);
                done();
            }, done);
        });*/

        it('returns the correct response', async () => {
            expect((await consumer.getUser(1))).toStrictEqual(userExample);
        });
    });

})