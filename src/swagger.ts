import { PORT } from "./app";

/**
 *  Swagger Configuration
 */
export const swaggerSpec = {
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