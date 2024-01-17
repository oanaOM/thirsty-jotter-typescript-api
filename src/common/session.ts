export const sessionOpt = {
    name: "session",
    secret: "superSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        path: '/'
    },
}

if (process.env.NODE_ENV === 'production') {
    sessionOpt.cookie.secure = true // serve secure cookies
}