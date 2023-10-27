import {Consumer} from "./consumer";
import * as path from "path";
import {integer, like, term} from "@pact-foundation/pact/src/dsl/matchers";
import {number} from "@pact-foundation/pact/src/v3/matchers";
import {PactV3} from "@pact-foundation/pact";


describe('The Consumer API', () => {
    const url = 'http://127.0.0.1';
    let consumer: Consumer;

    const provider = new PactV3({
        // port,
        dir: path.resolve(process.cwd(), 'pacts'),
        consumer: 'Consumer',
        provider: 'Provider',
    });

    const userExample = {id:1, name: 'Leo', password: 'Passwort'};
    const EXPECTED_BODY = like(userExample);


    describe('get /user?:id', () => {

        it('returns the correct response', () => {
            provider
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
            return provider.executeTest(async () => {
                expect(await consumer.getUser(1)).toStrictEqual(userExample);
            });
        });
    });

    describe('get /user?:id 2', () => {
        beforeAll(() => {
            provider
                .given('the requested user is not existing')
                .uponReceiving('a request for a user with specific id')
                .withRequest({
                    method: 'GET',
                    path: '/user',
                    headers: {
                        Accept: 'application/json',
                    },
                    query: {
                        id: '5'
                    },
                })
                .willRespondWith({
                    status: 404
                });
        });

        it('will throw an error', async () => {
            await expect(consumer.getUserAsAxiosPromise(5)).rejects.toThrow();
        });

    });

    describe('post /user?name=X&passsword=X', () => {
        const example: number = 5;
        const SAMPLE = like(example);

        beforeAll(() => {
            provider
                .given('the requested user is not existing')
                .uponReceiving('a request to create a user with specific name and password')
                .withRequest({
                    method: 'POST',
                    path: '/user',
                    headers: {
                        Accept: 'text/plain',
                    },
                    query: {
                        name: 'Uwe',
                        password: 'MyPassword'
                    },
                })
                .willRespondWith({
                    status: 201,
                    headers: {
                        'Content-Type': 'text/html;charset=utf-8',
                    },
                    body: number(6788)
                });
        });

        it('will return id of new created user', async () => {
            expect(await consumer.createUser('Uwe', 'MyPassword')).toStrictEqual(example);
        });

    });

})