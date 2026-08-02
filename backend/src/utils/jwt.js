import jwt from "jsonwebtoken";
import env from "../config/env.js";

/*
|--------------------------------------------------------------------------
| Shared JWT Payload
|--------------------------------------------------------------------------
*/

const createPayload = (user) => ({
    userId: user._id,
    email: user.email,
    role: user.role
});

/*
|--------------------------------------------------------------------------
| Access Token
|--------------------------------------------------------------------------
*/

export const generateAccessToken = (user) => {

    return jwt.sign(
        createPayload(user),
        env.JWT_SECRET,
        {
            expiresIn: "59m"
        }
    );

};

export const verifyAccessToken = (token) => {

    return jwt.verify(
        token,
        env.JWT_SECRET
    );

};

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

export const generateRefreshToken = (user) => {

    return jwt.sign(
        createPayload(user),
        env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );

};

export const verifyRefreshToken = (token) => {

    return jwt.verify(
        token,
        env.REFRESH_TOKEN_SECRET
    );

};