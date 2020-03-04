import { Container } from "typedi";

import { Router } from '@/router';
import { EventBus } from '@/events';
import { HTTPServer } from '@/http/server';


async function main() {
    const domain = getEnvOrError('DOMAIN');
    const runtimeURL = getEnvOrError('RUNTIME_URL');

    const eventBus = new EventBus(runtimeURL);
    Container.set("eventBus", eventBus);

    const router = new Router(domain);
    const server = new HTTPServer(router);
    await server.start('9000');
}

function getEnvOrError(envVar: string): string {
    if (!process.env[envVar]) {
        throw new Error(`Environment variable '` + envVar + `' must be set.`);
    }
    return process.env[envVar] || '';
}

main().then(() => {
    console.log("🚀 Running on :9000!");
}).catch(err => {
    console.error(err);
    process.exit(1);
});
