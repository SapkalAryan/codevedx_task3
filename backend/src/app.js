import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import notFoundHandler from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
    // console.log("===== HEALTH ROUTE HIT =====");

    res.status(200).json({
        success: true,
        message: "Health route reached"
    });
});

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/watchlist", watchlistRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;