/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import { app } from "./app";
// import { server } from "../test/mocks/node";

/**
 * App Variables
 */

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string, 10);

if (!process.env.PORT) {
  process.exit(1);
}

/**
 * Server Activation
 */
// mock server intercepting the requests
// server.listen();

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log("Server listen on port: ", PORT);
  /* eslint-enable no-console */
});
