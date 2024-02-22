export const sessionOpt = {
    name: "session",
    secret: "superSecretKey", // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        // secure: true,
        path: '/'
    },
}

// TODO: double check how this works. I think is creating a new session ID and I'm not sure if we want that.
// if (process.env.NODE_ENV === 'production') {
//     sessionOpt.cookie.secure = true // serve secure cookies
// }