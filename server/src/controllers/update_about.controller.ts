import { Context } from "elysia";
import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { ApiResponse } from "../utils/ApiResponse";
import { eq } from "drizzle-orm";
import * as jose from "jose";

export const update_about_controller = async (ctx: Context) => {
    const access_token = ctx.cookie["access_token"].value;
    const body = await ctx.request.json();
    try {
        // Check if access token exists
        if (!access_token) {
            return new ApiResponse({
                status: 401,
                message: "Unauthorized - No access token found",
                data: {},
                success: false
            }).toJSON();
        }

        // Verify and decode the access token
        let decoded_token;
        try {
            const access_secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
            const { payload } = await jose.jwtVerify(access_token, access_secret);
            decoded_token = payload;
        } catch (error) {
            return new ApiResponse({
                status: 401,
                message: "Unauthorized - Invalid or expired access token",
                data: {},
                success: false
            }).toJSON();
        }

        // Verify the user is updating their own profile (security check)
        if (decoded_token.id !== Number(body.id)) {
            return new ApiResponse({
                status: 403,
                message: "Forbidden - You can only update your own profile",
                data: {decoded_token, body},
                success: false
            }).toJSON();
        }

        // Update the user's about field
        const updated_user = await db
            .update(users)
            .set({ about: body.about })
            .where(eq(users.id, Number(body.id)))
            .returning();

        if (updated_user.length === 0) {
            return new ApiResponse({
                status: 404,
                message: "User not found",
                data: {},
                success: false
            }).toJSON();
        }

        // Generate new tokens with updated user data
        const access_secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
        const new_access_token = await new jose.SignJWT({
            id: updated_user[0].id,
            username: updated_user[0].username,
            email: updated_user[0].email,
            about: updated_user[0].about, // Include the updated about field
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(access_secret);

        const refresh_secret = new TextEncoder().encode(process.env.REFRESH_TOKEN);
        const new_refresh_token = await new jose.SignJWT({
            id: updated_user[0].id,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(refresh_secret);

        return new ApiResponse({
            status: 200,
            message: "About updated successfully",
            data: {
                user: {
                    id: updated_user[0].id,
                    username: updated_user[0].username,
                    email: updated_user[0].email,
                    about: updated_user[0].about
                },
                tokens: {
                    access_token: new_access_token,
                    refresh_token: new_refresh_token
                }
            },
            success: true
        }).toJSON();

    } catch (error) {
        console.error("Error in update_about_controller:", error);
        return new ApiResponse({
            status: 500,
            message: "Error updating about",
            data: {},
            success: false,
        }).toJSON();
    }
};