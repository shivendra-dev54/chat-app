import { Context } from "elysia";
import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { ApiResponse } from "../utils/ApiResponse";

export const user_all_controller = async ({ cookie: { access_token } }: any) => {
    try {
        if(!access_token){
            return new ApiResponse({
                status: 401,
                message: "Unauthorized",
                data: [access_token],
                success: false
            }).toJSON();
        }
        
        const allUsers = await db.select().from(users);

        if (allUsers.length === 0) {
            return new ApiResponse({
                status: 404,
                message: "no users found",
                data: [],
                success: false
            }).toJSON();
        }

        const formattedUsers = allUsers.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            about: user.about
        }));

        return new ApiResponse({
            status: 200,
            message: "successfully fetched all users",
            data: formattedUsers,
            success: true
        }).toJSON();

    } catch (error) {
        return new ApiResponse({
            status: 500,
            message: "Error fetching users",
            data: error,
            success: false,
        }).toJSON();
    }
};