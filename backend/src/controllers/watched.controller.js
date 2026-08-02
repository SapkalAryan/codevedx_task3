import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import watchedService from "../services/watched.service.js";

const addMovie = asyncHandler(async (req, res) => {

    const movie =
        await watchedService.addMovie(

            req.user._id,

            req.body

        );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Movie added to watched movies",

            movie

        )

    );

});

const getMovies = asyncHandler(async (req, res) => {

    const {

        page,

        limit,

        sort

    } = req.query;

    const watchedMovies =
        await watchedService.getMovies(

            req.user._id,

            page,

            limit,

            sort

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Watched movies fetched successfully",

            watchedMovies

        )

    );

});

const updateMovie = asyncHandler(async (req, res) => {

    const movie =
        await watchedService.updateMovie(

            req.user._id,

            Number(req.params.movieId),

            req.body

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Watched movie updated successfully",

            movie

        )

    );

});

const removeMovie = asyncHandler(async (req, res) => {

    await watchedService.removeMovie(

        req.user._id,

        Number(req.params.movieId)

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Movie removed from watched movies"

        )

    );

});

const checkMovie = asyncHandler(async (req, res) => {

    const result =
        await watchedService.checkMovie(

            req.user._id,

            Number(req.params.movieId)

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Watched status fetched",

            result

        )

    );

});

export {

    addMovie,

    getMovies,

    updateMovie,

    removeMovie,

    checkMovie

};