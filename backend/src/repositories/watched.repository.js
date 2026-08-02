import Watched from "../models/Watched.js";

class WatchedRepository {

    async create(movieData) {

        return await Watched.create(
            movieData
        );

    }

    async findMovie(userId, movieId) {

        return await Watched.findOne({

            user: userId,

            movieId

        });

    }

    async findAll(
        userId,
        skip,
        limit,
        sort
    ) {

        return await Watched.find({

            user: userId

        })

            .sort(sort)

            .skip(skip)

            .limit(limit);

    }

    async update(
        userId,
        movieId,
        updateData
    ) {

        return await Watched.findOneAndUpdate(

            {

                user: userId,

                movieId

            },

            updateData,

            {

                returnDocument: "after",

                runValidators: true

            }

        );

    }

    async delete(
        userId,
        movieId
    ) {

        return await Watched.findOneAndDelete({

            user: userId,

            movieId

        });

    }

    async count(userId) {

        return await Watched.countDocuments({

            user: userId

        });

    }

}

export default new WatchedRepository();