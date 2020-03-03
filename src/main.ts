import { HTTPServer } from './http/server';
import Router from './router';

async function main() {
    const domain = getEnvOrError('DOMAIN');
    const router = new Router(domain);

    const server = new HTTPServer(router);
    server.start('9000');
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
