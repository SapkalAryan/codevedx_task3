import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        avatar: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        preferences: {

            favoriteGenres: {
                type: [String],
                default: []
            },

            favoriteLanguages: {
                type: [String],
                default: []
            },

            favoriteStreamingServices: {
                type: [String],
                default: []
            },

            favoriteDecades: {
                type: [String],
                default: []
            }

        },

        refreshToken: {
            type: String,
            default: null
        }

    },
    {
        timestamps: true
    }
);
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;