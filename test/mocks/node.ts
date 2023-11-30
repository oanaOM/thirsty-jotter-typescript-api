import { setupServer } from "msw/node";
import { getPlants } from "./handlers/plants";

export const server = setupServer(...getPlants);

server.events.on("request:start", ({ request }) => {
  /* eslint-disable no-console */
  console.log("MSW intercepted:", request.method, request.url);
  /* eslint-enable no-console */
});
