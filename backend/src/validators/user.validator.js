import { body } from "express-validator";

const updateProfileValidation = [

    body("name")
        .optional()
        .trim()
        .isLength({
            min: 2,
            max: 50
        })
        .withMessage(
            "Name must be between 2 and 50 characters"
        ),

    body("avatar")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Avatar must be a valid URL"
        )

];

const changePasswordValidation = [

    body("currentPassword")
        .notEmpty()
        .withMessage(
            "Current password is required"
        ),

    body("newPassword")
        .isLength({
            min: 6
        })
        .withMessage(
            "New password must be at least 6 characters long"
        )

];

const updatePreferencesValidation = [

    body("favoriteGenres")
        .optional()
        .isArray()
        .withMessage(
            "favoriteGenres must be an array"
        ),

    body("favoriteLanguages")
        .optional()
        .isArray()
        .withMessage(
            "favoriteLanguages must be an array"
        ),

    body("favoriteStreamingServices")
        .optional()
        .isArray()
        .withMessage(
            "favoriteStreamingServices must be an array"
        ),

    body("favoriteDecades")
        .optional()
        .isArray()
        .withMessage(
            "favoriteDecades must be an array"
        )

];

export {
    updateProfileValidation,
    changePasswordValidation,
    updatePreferencesValidation
};