import HTTPServiceManager from "./manager";
import { HTTPServer } from "./http/server";
 
async function main() {
    const serviceManager = new HTTPServiceManager();

    const server = new HTTPServer(serviceManager);
    server.start('9000');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
