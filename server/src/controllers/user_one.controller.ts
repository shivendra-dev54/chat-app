import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { eq } from "drizzle-orm";
import { ApiResponse } from "../utils/ApiResponse";
import { Context } from "elysia";
import * as jose from "jose";

export const user_one_controller = async (ctx: Context) => {
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
        // 🔑 verify access token
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
        const { payload } = await jose.jwtVerify(access_token, secret);

        // ✅ token is valid, continue
        const id: number = Number(ctx.params.id);

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (user.length === 0) {
            return new ApiResponse({
                status: 404,
                message: "User not found",
                data: null,
                success: false,
            }).toJSON();
        }

        return new ApiResponse({
            status: 200,
            message: "Successfully fetched user",
            data: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email,
                about: user[0].about,
            },
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
