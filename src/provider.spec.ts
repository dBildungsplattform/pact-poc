import {Verifier} from "@pact-foundation/pact";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import * as path from "path";
import {StateHandler} from "@pact-foundation/pact/src/dsl/verifier/proxy/types";
import {INestApplication} from "@nestjs/common";

async function start() {
    const app = await NestFactory.create(AppModule);
    return await app.listen(8081);
}

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await start();
    })

    afterAll(async () => {
        await app.close();
    })

    it('validates the expectations of Matching Service', async () => {
        const output = await new Verifier({
            provider: 'Provider',
            providerBaseUrl: 'http://localhost:8081',
            pactUrls: [
                path.resolve(
                    process.cwd(),
                    './pacts/Consumer-Provider.json'
                ),
            ],
            stateHandlers: {
                'I have a list of users': () => {
                    return Promise.resolve();
                },
                'the requested user is not existing': () => {
                    return Promise.resolve();
                }
            }
        }).verifyProvider();

        console.log('Pact Verification Complete!');
        console.log('Result:', output);
        return output;
    });
});