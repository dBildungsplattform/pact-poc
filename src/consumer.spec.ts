import {Consumer} from "./consumer";
import * as path from "path";
import {Interaction, Matcher, Matchers, Pact} from "@pact-foundation/pact";
import {like} from "@pact-foundation/pact/src/dsl/matchers";

type UserType = {id: number, name: string, password: string};

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

    const userExample: UserType = {id:1, name: 'Leo', password: 'Passwort'};
    const EXPECTED_BODY: Matcher<UserType> = like(userExample);

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
                    body: userExample,
                });
            return provider.addInteraction(interaction);
        });

        it('returns the correct response', async () => {
            expect(await consumer.getUser(1)).toEqual(userExample);
        });

    });

    describe('get /user?:id 2', () => {
        beforeAll(() => {
            const interaction = new Interaction()
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
            return provider.addInteraction(interaction);
        });

        it('will throw an error', async () => {
            await expect(consumer.getUserAsAxiosPromise(5)).rejects.toThrow();
        });

    });

    describe('post /user?name=X&passsword=X', () => {
        const example: number = 5;
        const SAMPLE = like(example);

        beforeAll(() => {
            const interaction = new Interaction()
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
                    body: 1
                });
            return provider.addInteraction(interaction);
        });

        it('will return id of new created user', async () => {
            Matchers.integer(3)
            expect(await consumer.createUser('Uwe', 'MyPassword')).toEqual(1);
        });

    });

})