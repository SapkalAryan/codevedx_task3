import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5000,

    MONGODB_URI: process.env.MONGODB_URI || "",

    JWT_SECRET: process.env.JWT_SECRET || "",

    REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET || "",

    TMDB_API_KEY: process.env.TMDB_API_KEY || ""
};

export default env;