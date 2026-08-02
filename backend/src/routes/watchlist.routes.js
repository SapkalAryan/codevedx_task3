import { Router } from "express";

import {
    addMovie,
    getWatchlist,
    removeMovie,
    checkMovie
} from "../controllers/watchlist.controller.js";

import {
    addMovieValidation
} from "../validators/watchlist.validator.js";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../validators/validate.js";

const router = Router();

router.post(
    "/",
    authenticate,
    addMovieValidation,
    validate,
    addMovie
);

router.get(
    "/",
    authenticate,
    getWatchlist
);

router.get(
    "/check/:movieId",
    authenticate,
    checkMovie
);

router.delete(
    "/:movieId",
    authenticate,
    removeMovie
);

export default router;