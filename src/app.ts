import express from "express";
import cors from "cors";
import helmet from "helmet";
import { plantsRouter } from "./handlers/plants/plants";
import { errorHandler } from "./middleware/error";
import { notFoundHandler } from "./middleware/not-found";
import { authRouter } from "./handlers/authentication/login";
import { userRouter } from "./handlers/users/validate";

import swaggerUI from "swagger-ui-express"
import swaggerJSdoc from "swagger-jsdoc"

const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
export const app = express();


console.log("---HELLO", process.env.PORT)

/**
 *  Swagger Configuration
 */
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ThirstyJotter API',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            }
        ]
    },
    host: `localhost:${PORT}`, // Host (optional)
    apis: ["**/*.ts"],
  }

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerJSdoc(swaggerSpec))
)
// parses the incoming request with JSON payloads
app.use(express.json());
app.use("/api", authRouter);
app.use("/api", plantsRouter);
app.use("/api", userRouter);

// middlewares order in which they are declared and invoked is crucial for the architecture of the app.
app.use(errorHandler);
app.use(notFoundHandler);
