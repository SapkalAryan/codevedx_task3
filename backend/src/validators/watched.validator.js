import { body } from "express-validator";

const addMovieValidation = [

    body("movieId")
        .isInt()
        .withMessage(
            "Movie ID is required"
        ),

    body("title")
        .trim()
        .notEmpty()
        .withMessage(
            "Title is required"
        ),

    body("posterPath")
        .trim()
        .notEmpty()
        .withMessage(
            "Poster path is required"
        ),

    body("releaseDate")
        .optional()
        .isString()
        .withMessage(
            "Release date must be a string"
        ),

    body("voteAverage")
        .optional()
        .isFloat({
            min: 0,
            max: 10
        })
        .withMessage(
            "Vote average must be between 0 and 10"
        )

];

const updateMovieValidation = [

    body("isFavourite")
        .optional()
        .isBoolean()
        .withMessage(
            "isFavourite must be a boolean"
        ),

    body("watchDate")
        .optional()
        .isISO8601()
        .withMessage(
            "watchDate must be a valid date"
        ),

    body("rewatchCount")
        .optional()
        .isInt({
            min: 1
        })
        .withMessage(
            "rewatchCount must be at least 1"
        )

];

export {

    addMovieValidation,

    updateMovieValidation

};