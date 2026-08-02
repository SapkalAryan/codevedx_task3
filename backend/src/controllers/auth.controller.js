import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";

const register = asyncHandler(async (req, res) => {

    const result = await authService.register(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            result
        )
    );

});

const login = asyncHandler(async (req, res) => {

    // console.log("===== LOGIN CONTROLLER HIT =====");

    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            result
        )
    );

});

const refreshToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    const result =
        await authService.refreshAccessToken(
            refreshToken
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Access token refreshed successfully",
            result
        )
    );

});

const logout = asyncHandler(async (req, res) => {

    await authService.logout(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Logout successful"
        )
    );

});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            "Current user fetched successfully",
            req.user
        )
    );

});

export {
    register,
    login,
    refreshToken,
    logout,
    getCurrentUser
};