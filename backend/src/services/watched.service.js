import watchedRepository from "../repositories/watched.repository.js";
import ApiError from "../utils/ApiError.js";

class WatchedService {

    async addMovie(userId, movieData) {

        const existingMovie =
            await watchedRepository.findMovie(
                userId,
                movieData.movieId
            );

        if (existingMovie) {

            throw new ApiError(
                409,
                "Movie already exists in watched movies"
            );

        }

        return await watchedRepository.create({

            user: userId,

            ...movieData

        });

    }

    async getMovies(

        userId,

        page = 1,

        limit = 20,

        sort = "latest"

    ) {

        const sortOptions = {

            latest: {
                watchDate: -1
            },

            oldest: {
                watchDate: 1
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
            await watchedRepository.findAll(

                userId,

                skip,

                Number(limit),

                sortQuery

            );

        const total =
            await watchedRepository.count(
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

    async updateMovie(
        userId,
        movieId,
        updateData
    ) {

        const allowedUpdates = {

            isFavourite: updateData.isFavourite,

            watchDate: updateData.watchDate,

            rewatchCount: updateData.rewatchCount

        };

        Object.keys(allowedUpdates).forEach((key) => {

            if (allowedUpdates[key] === undefined) {

                delete allowedUpdates[key];

            }

        });

        const movie =
            await watchedRepository.update(

                userId,

                movieId,

                allowedUpdates

            );

        if (!movie) {

            throw new ApiError(
                404,
                "Movie not found"
            );

        }

        return movie;

    }

    async removeMovie(
        userId,
        movieId
    ) {

        const movie =
            await watchedRepository.delete(

                userId,

                movieId

            );

        if (!movie) {

            throw new ApiError(
                404,
                "Movie not found"
            );

        }

    }

    async checkMovie(
        userId,
        movieId
    ) {

        const movie =
            await watchedRepository.findMovie(

                userId,

                movieId

            );

        return {

            isWatched: !!movie

        };

    }

}

export default new WatchedService();