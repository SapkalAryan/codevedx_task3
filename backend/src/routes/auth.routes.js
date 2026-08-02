import { Router } from "express";

import {
    register,
    login,
    refreshToken,
    logout,
    getCurrentUser
} from "../controllers/auth.controller.js";

import {
    registerValidation,
    loginValidation
} from "../validators/auth.validator.js";

import validate from "../validators/validate.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    registerValidation,
    validate,
    register
);

router.post(
    "/login",
    (req, res, next) => {
        // console.log("===== LOGIN ROUTE HIT =====");
        next();
    },
    loginValidation,
    validate,
    login
);

router.post(
    "/refresh-token",
    refreshToken
);

router.post(
    "/logout",
    authenticate,
    logout
);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

export default router;