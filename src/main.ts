import { Router } from './router';
import { EventBus } from './events';
import { HTTPServer } from './http/server';

async function main() {
    const domain = getEnvOrError('DOMAIN');
    const runtimeURL = getEnvOrError('RUNTIME_URL');

    const events = new EventBus(runtimeURL);
    const router = new Router(domain, events);

    const server = new HTTPServer(router);
    await server.start('9000');
}

function getEnvOrError(envVar: string): string {
    if (!process.env[envVar]) {
        throw new Error(`Environment variable '` + envVar + `' must be set.`);
    }
    return process.env[envVar] || '';
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
