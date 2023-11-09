import express from "express";
import cors from "cors";
import helmet from "helmet";
import { plantsRouter } from "./handlers/plants";
import { errorHandler } from "./middleware/error";
import { notFoundHandler } from "./middleware/not-found";

export const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
// parses the incoming request with JSON payloads
app.use(express.json());
app.use("/api", plantsRouter);

// middlewares order in which they are declared and invoked is crucial for the architecture of the app.
app.use(errorHandler);
app.use(notFoundHandler);
