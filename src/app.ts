import express from "express";
import cors from "cors";
import helmet from "helmet";
import { plantsRouter } from "./handlers/plants/plants";
import { errorHandler } from "./middleware/error";
import { notFoundHandler } from "./middleware/not-found";
import { authRouter } from "./handlers/authentication/authentication";
import { userRouter } from "./handlers/users/user";

import swaggerUI from "swagger-ui-express"
import swaggerJSdoc from "swagger-jsdoc"
import { swaggerSpec } from "./swagger";
import session from "express-session";
import { sessionOpt } from "./common/session";
import { sessionMiddleware } from "./middleware/session";

export const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
export const app = express();


/**
 *  App Configuration
 */

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
}

/**
 *  Middlewares
 */

app.use(express.urlencoded({ extended: true })); // parse Request Object as strings or arrays
app.use(express.json());

app.use(helmet());
app.use(session(sessionOpt)
)

app.use(cors({ credentials: true, origin: 'http://localhost:4321' }));
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerJSdoc(swaggerSpec))
)
// parses the incoming request with JSON payloads
app.use("/api", authRouter);

app.get("/api/ping",sessionMiddleware, function (req,res){
    console.info("/ping session id: ", req.sessionID)
    console.info("/ping request: ", req.session)
    res.send("pong");
})

app.use("/api", plantsRouter);
app.use("/api", userRouter);

// middlewares order in which they are declared and invoked is crucial for the architecture of the app.
app.use(errorHandler);
app.use(notFoundHandler);
