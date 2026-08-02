import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(

    {

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true

        },

        movieId: {

            type: Number,

            required: true

        },

        title: {

            type: String,

            required: true,

            trim: true

        },

        posterPath: {

            type: String,

            required: true

        },

        releaseDate: {

            type: String,

            default: ""

        },

        voteAverage: {

            type: Number,

            default: 0

        },

        addedAt: {

            type: Date,

            default: Date.now

        }

    },

    {

        timestamps: true

    }

);

watchlistSchema.index(

    {

        user: 1,

        movieId: 1

    },

    {

        unique: true

    }

);

const Watchlist = mongoose.model(
    "Watchlist",
    watchlistSchema
);

export default Watchlist;