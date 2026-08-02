import { Router } from "express";

import {
    addMovie,
    getMovies,
    updateMovie,
    removeMovie,
    checkMovie
} from "../controllers/watched.controller.js";

import {
    addMovieValidation,
    updateMovieValidation
} from "../validators/watched.validator.js";

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
    getMovies
);

router.get(
    "/check/:movieId",
    authenticate,
    checkMovie
);

router.put(
    "/:movieId",
    authenticate,
    updateMovieValidation,
    validate,
    updateMovie
);

router.delete(
    "/:movieId",
    authenticate,
    removeMovie
);

export default router;