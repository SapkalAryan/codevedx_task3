import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import userService from "../services/user.service.js";

const getProfile = asyncHandler(async (req, res) => {

    const profile =
        await userService.getProfile(
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile fetched successfully",
            profile
        )
    );

});

const updateProfile = asyncHandler(async (req, res) => {

    const updatedProfile =
        await userService.updateProfile(
            req.user._id,
            req.body
        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Profile updated successfully",

            updatedProfile

        )

    );

});

const changePassword = asyncHandler(async (req, res) => {

    const {

        currentPassword,

        newPassword

    } = req.body;

    await userService.changePassword(

        req.user._id,

        currentPassword,

        newPassword

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Password changed successfully"

        )

    );

});

const deleteAccount = asyncHandler(async (req, res) => {

    await userService.deleteAccount(
        req.user._id
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Account deleted successfully"

        )

    );

});

const updatePreferences = asyncHandler(async (req, res) => {

    const result =
        await userService.updatePreferences(

            req.user._id,

            req.body

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Preferences updated successfully",

            result

        )

    );

});

export {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    updatePreferences,
};