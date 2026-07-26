import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import notFoundHandler from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Cine Buddy Backend Running"
    });
});

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

// Must come AFTER all routes
app.use(notFoundHandler);

// Must be LAST
app.use(errorHandler);

export default app;