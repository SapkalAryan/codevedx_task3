import mongoose from "mongoose";

const watchedSchema = new mongoose.Schema(

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

        isFavourite: {

            type: Boolean,

            default: false

        },

        watchDate: {

            type: Date,

            default: Date.now

        },

        rewatchCount: {

            type: Number,

            default: 1,

            min: 1

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

watchedSchema.index(

    {

        user: 1,

        movieId: 1

    },

    {

        unique: true

    }

);

const Watched = mongoose.model(
    "Watched",
    watchedSchema
);

export default Watched;