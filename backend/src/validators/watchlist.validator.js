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

export {

    addMovieValidation

};
