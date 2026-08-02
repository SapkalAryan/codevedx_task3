import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import userRepository from "../repositories/user.repository.js";

const authenticate = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                new ApiError(
                    401,
                    "Access token is required"
                )
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyAccessToken(token);

        const user = await userRepository.findById(decoded.userId);

        if (!user) {
            return next(
                new ApiError(
                    401,
                    "User no longer exists"
                )
            );
        }

        req.user = user;

        next();

    } catch (error) {

        return next(
            new ApiError(
                401,
                "Invalid or expired access token"
            )
        );

    }

};

export default authenticate;