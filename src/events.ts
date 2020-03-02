import bent from "bent";

const runtime = bent('http://localhost:9001', "POST", "json", 200);

class EventManager {
  /**
   * Submits events to the runtime and waits for a response.
   */
  async submitEvent(
    eventID: string,
    payload: any /*eslint-disable-line @typescript-eslint/no-explicit-any */
  ): Promise<void> {
    const event = {
      id: eventID,
      payload: payload,
    };
    console.log("event.submit: ", { eventID, payload });
    await runtime("/app/events", event);
  }
}

const eventManager = new EventManager();

export default eventManager;
