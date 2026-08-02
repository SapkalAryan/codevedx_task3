import { Router } from "express";

import {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    updatePreferences
} from "../controllers/user.controller.js";

import {
    updateProfileValidation,
    changePasswordValidation,
    updatePreferencesValidation
} from "../validators/user.validator.js";

import validate from "../validators/validate.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.get(
    "/profile",
    authenticate,
    getProfile
);

router.put(
    "/profile",
    authenticate,
    updateProfileValidation,
    validate,
    updateProfile
);

router.put(
    "/change-password",
    authenticate,
    changePasswordValidation,
    validate,
    changePassword
);

router.delete(
    "/profile",
    authenticate,
    deleteAccount
);

router.put(
    "/preferences",
    authenticate,
    updatePreferencesValidation,
    validate,
    updatePreferences
);

export default router;