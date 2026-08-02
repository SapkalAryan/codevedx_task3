import watchlistRepository from "../repositories/watchlist.repository.js";
import ApiError from "../utils/ApiError.js";

class WatchlistService {

    async addMovie(userId, movieData) {

        const existingMovie =
            await watchlistRepository.findMovie(
                userId,
                movieData.movieId
            );

        if (existingMovie) {

            throw new ApiError(
                409,
                "Movie already exists in watchlist"
            );

        }

        return await watchlistRepository.addMovie({

            user: userId,

            ...movieData

        });

    }

    async getWatchlist(

        userId,

        page = 1,

        limit = 20,

        sort = "latest"

    ) {

        const sortOptions = {

            latest: {
                addedAt: -1
            },

            oldest: {
                addedAt: 1
            },

            rating: {
                voteAverage: -1
            },

            title: {
                title: 1
            }

        };

        const sortQuery =
            sortOptions[sort] ||
            sortOptions.latest;

        const skip =
            (page - 1) * limit;

        const movies =
            await watchlistRepository.getWatchlist(

                userId,

                skip,

                Number(limit),

                sortQuery

            );

        const total =
            await watchlistRepository.countWatchlist(
                userId
            );

        return {

            movies,

            pagination: {

                page: Number(page),

                limit: Number(limit),

                total,

                pages: Math.ceil(
                    total / limit
                )

            }

        };

    }

    async removeMovie(
        userId,
        movieId
    ) {

        const movie =
            await watchlistRepository.removeMovie(

                userId,

                movieId

            );

        if (!movie) {

            throw new ApiError(

                404,

                "Movie not found in watchlist"

            );

        }

    }

    async checkMovie(
        userId,
        movieId
    ) {

        const movie =
            await watchlistRepository.findMovie(

                userId,

                movieId

            );

        return {

            isInWatchlist: !!movie

        };

    }

}

export default new WatchlistService();