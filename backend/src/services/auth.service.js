
import userRepository from "../repositories/user.repository.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";

// console.log("===== AUTH SERVICE LOADED =====");
class AuthService {

    sanitizeUser(user) {

        const userObject = user.toObject();

        const {
            password,
            __v,
            refreshToken,
            ...safeUser
        } = userObject;

        return safeUser;
    }

    async register(userData) {

        const existingUser =
            await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new ApiError(
                409,
                "User already exists"
            );
        }

        const user =
            await userRepository.create(userData);

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        // console.log("Generated Refresh Token:");
        // console.log(refreshToken);

        const updatedUser =
            await userRepository.updateById(
                user._id,
                {
                    refreshToken
                }
            );

        // console.log("Updated User:");
        // console.log(updatedUser);

        return {
            user: this.sanitizeUser(updatedUser),
            accessToken,
            refreshToken
        };
    }

    async login(email, password) {

        // console.log("===== LOGIN SERVICE CALLED =====");

        const user =
            await userRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                401,
                "Invalid email or password"
            );
        }

        const isPasswordValid =
            await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new ApiError(
                401,
                "Invalid email or password"
            );
        }

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        // console.log("Generated Refresh Token:");
        // console.log(refreshToken);

        const updatedUser =
            await userRepository.updateById(
                user._id,
                {
                    refreshToken
                }
            );

        console.log("Generated Refresh Token:", refreshToken);

        // console.log("Updated User:");
        // console.log(updatedUser);

        return {
            user: this.sanitizeUser(updatedUser),
            accessToken,
            refreshToken
        };
    }

    async refreshAccessToken(refreshToken) {

        /*
        |--------------------------------------------------------------------------
        | 1. Validate Input
        |--------------------------------------------------------------------------
        */

        if (!refreshToken) {

            throw new ApiError(
                401,
                "Refresh token is required"
            );

        }

        /*
        |--------------------------------------------------------------------------
        | 2. Verify JWT Signature
        |--------------------------------------------------------------------------
        */

        let decodedToken;

        try {

            decodedToken =
                verifyRefreshToken(refreshToken);

        } catch {

            throw new ApiError(
                401,
                "Invalid refresh token"
            );

        }

        /*
        |--------------------------------------------------------------------------
        | 3. Find User
        |--------------------------------------------------------------------------
        */

        const user =
            await userRepository.findById(
                decodedToken.userId
            );

        if (!user) {

            throw new ApiError(
                401,
                "User not found"
            );

        }

        /*
        |--------------------------------------------------------------------------
        | 4. Compare Database Token
        |--------------------------------------------------------------------------
        */

        if (user.refreshToken !== refreshToken) {

            throw new ApiError(
                401,
                "Refresh token has expired"
            );

        }

        /*
        |--------------------------------------------------------------------------
        | 5. Generate New Access Token
        |--------------------------------------------------------------------------
        */

        const accessToken =
            generateAccessToken(user);

        return {
            accessToken
        };

    }

    async logout(userId) {

    await userRepository.removeRefreshToken(
        userId
    );

}

}

export default new AuthService();