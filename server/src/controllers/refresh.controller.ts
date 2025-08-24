import { Context } from "elysia";
import { ApiResponse } from "../utils/ApiResponse";
import * as jose from "jose";
import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { eq } from "drizzle-orm";

export const refresh_controller = async (ctx: Context) => {
    const token: string | undefined = ctx.cookie["refresh_token"]?.value;

    if (!token) {
        return new ApiResponse({
            status: 401,
            message: "No refresh token provided",
            data: {},
            success: false,
        }).toJSON();
    }

    try {
        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN);

        // verify refresh token
        const { payload } = await jose.jwtVerify(token, secret);

        const user_id = payload.id as number;
        if (!user_id) {
            return new ApiResponse({
                status: 401,
                message: "Invalid refresh token",
                data: {},
                success: false,
            }).toJSON();
        }

        // fetch user
        const user_from_db = await db
            .select()
            .from(users)
            .where(eq(users.id, user_id))
            .limit(1);

        if (user_from_db.length === 0) {
            return new ApiResponse({
                status: 404,
                message: "User not found",
                data: {},
                success: false,
            }).toJSON();
        }

        // 🔑 check if refresh token matches DB
        if (user_from_db[0].refresh_token !== token) {
            // clear cookies
            ctx.cookie["access_token"].set({
                value: "",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 0,
                path: "/",
            });
            ctx.cookie["refresh_token"].set({
                value: "",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 0,
                path: "/",
            });

            return new ApiResponse({
                status: 400,
                message: "Refresh token mismatch. Please log in again.",
                data: {},
                success: false,
            }).toJSON();
        }

        // create new access token
        const access_secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
        const access_token = await new jose.SignJWT({
            id: user_from_db[0].id,
            username: user_from_db[0].username,
            email: user_from_db[0].email,
            about: user_from_db[0].about,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(access_secret);

        // create new refresh token
        const refresh_secret = new TextEncoder().encode(process.env.REFRESH_TOKEN);
        const refresh_token = await new jose.SignJWT({
            id: user_from_db[0].id,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(refresh_secret);

        // update DB with new refresh token
        await db
            .update(users)
            .set({ refresh_token })
            .where(eq(users.id, user_id));

        // set cookies
        ctx.cookie["access_token"].set({
            value: access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1h
            path: "/",
        });

        ctx.cookie["refresh_token"].set({
            value: refresh_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7d
            path: "/",
        });

        return new ApiResponse({
            status: 200,
            message: "Token refreshed successfully",
            data: {
                id: user_from_db[0].id,
                username: user_from_db[0].username,
                email: user_from_db[0].email,
            },
            success: true,
        }).toJSON();
    } catch (err) {
        return new ApiResponse({
            status: 401,
            message: "Invalid or expired refresh token",
            data: {},
            success: false,
        }).toJSON();
    }
};
