import Watchlist from "../models/Watchlist.js";

class WatchlistRepository {

    async addMovie(movieData) {

        return await Watchlist.create(
            movieData
        );

    }

    async findMovie(userId, movieId) {

        return await Watchlist.findOne({

            user: userId,

            movieId

        });

    }

    async getWatchlist(
        userId,
        skip,
        limit,
        sort
    ) {

        return await Watchlist.find({

            user: userId

        })

            .sort(sort)

            .skip(skip)

            .limit(limit);

    }

    async removeMovie(
        userId,
        movieId
    ) {

        return await Watchlist.findOneAndDelete({

            user: userId,

            movieId

        });

    }

    async countWatchlist(userId) {

        return await Watchlist.countDocuments({

            user: userId

        });

    }

}

export default new WatchlistRepository();