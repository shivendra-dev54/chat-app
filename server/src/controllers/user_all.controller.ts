import { Context } from "elysia";
import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { ApiResponse } from "../utils/ApiResponse";
import * as jose from "jose";

export const user_all_controller = async (ctx: Context) => {
    const access_token: string | undefined = ctx.cookie["access_token"]?.value;

    if (!access_token) {
        return new ApiResponse({
            status: 401,
            message: "Unauthorized - No access token",
            data: {},
            success: false,
        }).toJSON();
    }

    try {
        // verify access token
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
        const { payload } = await jose.jwtVerify(access_token, secret);

        // you can now trust `payload.id`
        const allUsers = await db.select().from(users);

        if (allUsers.length === 0) {
            return new ApiResponse({
                status: 404,
                message: "No users found",
                data: [],
                success: false,
            }).toJSON();
        }

        const formattedUsers = allUsers.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            about: user.about,
        }));

        return new ApiResponse({
            status: 200,
            message: "Successfully fetched all users",
            data: formattedUsers,
            success: true,
        }).toJSON();
    } catch (err: any) {
        if (err.code === "ERR_JWT_EXPIRED") {
            return new ApiResponse({
                status: 401,
                message: "Access token expired. Please refresh.",
                data: {},
                success: false,
            }).toJSON();
        }

        return new ApiResponse({
            status: 401,
            message: "Invalid access token",
            data: {},
            success: false,
        }).toJSON();
    }
};
