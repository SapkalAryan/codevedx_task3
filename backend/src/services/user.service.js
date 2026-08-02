import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

class UserService {

    sanitizeUser(user) {

        const userObject = user.toObject();

        const {
            password,
            refreshToken,
            __v,
            ...safeUser
        } = userObject;

        return safeUser;

    }

    async getProfile(userId) {

        const user =
            await userRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }

        return this.sanitizeUser(user);

    }

    async updateProfile(userId, updateData) {

        const user =
            await userRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }

        const updatedUser =
            await userRepository.updateById(
                userId,
                {
                    name:
                        updateData.name ?? user.name,

                    avatar:
                        updateData.avatar ?? user.avatar
                }
            );

        return this.sanitizeUser(updatedUser);

    }

    async changePassword(userId, currentPassword, newPassword) {

        const user =
            await userRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }

        const isPasswordValid =
            await user.comparePassword(
                currentPassword
            );

        if (!isPasswordValid) {

            throw new ApiError(
                401,
                "Current password is incorrect"
            );

        }

        user.password = newPassword;

        await user.save();

    }

    async deleteAccount(userId) {

        const user =
            await userRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }



        await userRepository.removeRefreshToken(
            userId
        );

        await userRepository.deleteById(
            userId
        );

    }

    async updatePreferences(userId, preferences) {

        const user =
            await userRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }

        const updatedUser =
            await userRepository.updateById(

                userId,

                {
                    preferences
                }

            );

        return this.sanitizeUser(
            updatedUser
        );

    }

    async updatePreferences(userId, preferences) {

    const user =
        await userRepository.findById(userId);

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );

    }

    const updatedPreferences = {

        ...user.preferences.toObject(),

        ...preferences

    };

    const updatedUser =
        await userRepository.updateById(

            userId,

            {
                preferences: updatedPreferences
            }

        );

    return this.sanitizeUser(
        updatedUser
    );

}
}

export default new UserService();