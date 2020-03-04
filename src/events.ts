import * as rm from 'typed-rest-client/HttpClient';


export class EventBus {

    private readonly httpClient: rm.HttpClient;
    private readonly runtimeURL: string;

    constructor(runtimeURL: string) {
        this.runtimeURL = runtimeURL;
        this.httpClient = new rm.HttpClient('http-service', [], {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }

    async submit(eventID: string, payload: any): Promise<void> {
        const body: { id: string, payload: any } = { id: eventID, payload };

        const res = await this.httpClient.post(this.runtimeURL + '/app/events', JSON.stringify(body));
        if (res.message.statusCode !== 200) {
            return Promise.reject(new Error(`Expected status code to be 200 but was ${res.message.statusCode}`));
        }
    }
}
