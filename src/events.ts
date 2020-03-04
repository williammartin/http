import * as rm from 'typed-rest-client/HttpClient';

class EventBus {

    private httpClient: rm.HttpClient;
    private runtimeURL: string;

    constructor(runtimeURL: string) {
        this.runtimeURL = runtimeURL;
        this.httpClient = new rm.HttpClient('http-service', [], {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }

    public async submit(eventID: string, payload: any /*eslint-disable-line @typescript-eslint/no-explicit-any */): Promise<void> {
        const body: { id: string, payload: any } = {
            id: eventID,
            payload: payload,
        };

        let res: rm.HttpClientResponse = await this.httpClient.post(this.runtimeURL + '/app/events', JSON.stringify(body));
        if (res.message.statusCode !== 200) {
            return Promise.reject(new Error(`Expected status code to be 200 but was ${res.message.statusCode}`));
        }
    }
}

export {
    EventBus
};
