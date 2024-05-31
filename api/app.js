import "dotenv/config.js";
import "express-async-errors";
import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet, { contentSecurityPolicy, frameguard } from "helmet";
import hpp from "hpp";
import toobusy from "toobusy-js";
import { rateLimit } from "express-rate-limit";

import apiRouterMain from "./routers/router_main.js";

const app = express();

const limiter = rateLimit({
    windowMs: 1000,
    limit: 100,
    statusCode: 429,
    standardHeaders: false,
    legacyHeaders: false
});

app.use(limiter);

app.use((req, res, next) => {
    if (toobusy()) {
        next(createError(503));
    } else {
        next();
    }
});

// view engine setup
app.use(cors());
app.use(hpp());
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use(contentSecurityPolicy({
    useDefaults: false,
    directives: {
        "default-src": "none"
    }
}));

app.use(frameguard({
    action: "deny"
}));

/**
 * Exclude null values from JSON responses to decrease the response size.
 * The front-end will generally interpret absent values the same as null values.
 */
app.set("json replacer", (k, v) => (v === null ? undefined : v));

// Routes for querying data
app.use("/api", apiRouterMain);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    const responseStatus = err.status || 500;
    res.status(responseStatus);
    res.json({
        error: {
            status: responseStatus,
            message: err.message,
            debugMessage: req.app.get("env") === "development" ? (err.debugMessage + "\n" + err.stack) : ""
        }
    });
});

app.set("port", process.env.PORT || 9000);

const server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
});
