import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import watchlistService from "../services/watchlist.service.js";

const addMovie = asyncHandler(async (req, res) => {

    const movie =
        await watchlistService.addMovie(

            req.user._id,

            req.body

        );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Movie added to watchlist",

            movie

        )

    );

});

const getWatchlist = asyncHandler(async (req, res) => {

    const {

        page,

        limit,

        sort

    } = req.query;

    const watchlist =
        await watchlistService.getWatchlist(

            req.user._id,

            page,

            limit,

            sort

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Watchlist fetched successfully",

            watchlist

        )

    );

});

const removeMovie = asyncHandler(async (req, res) => {

    await watchlistService.removeMovie(

        req.user._id,

        Number(req.params.movieId)

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Movie removed from watchlist"

        )

    );

});

const checkMovie = asyncHandler(async (req, res) => {

    const result =
        await watchlistService.checkMovie(

            req.user._id,

            Number(req.params.movieId)

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Watchlist status fetched",

            result

        )

    );

});

export {

    addMovie,

    getWatchlist,

    removeMovie,

    checkMovie

};