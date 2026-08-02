import User from "../models/User.js";

class UserRepository {

    async create(userData) {

        return await User.create(userData);

    }

    async findByEmail(email) {

        return await User.findOne({
            email
        });

    }

    async findById(id) {

        return await User.findById(id);

    }

    async findByRefreshToken(refreshToken) {

        return await User.findOne({
            refreshToken
        });

    }

    async updateById(id, updateData) {

        return await User.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

    }

    async removeRefreshToken(id) {

        return await User.findByIdAndUpdate(
            id,
            {
                refreshToken: null
            },
            {
                returnDocument: "after"
            }
        );

    }

    async deleteById(id) {

        return await User.findByIdAndDelete(id);

    }

}

export default new UserRepository();