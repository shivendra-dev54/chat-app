import { Context } from "elysia";
import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { ApiResponse } from "../utils/ApiResponse";
import { eq } from "drizzle-orm";

export const update_about_controller = async ({ body, cookie: { access_token } }: any) => {
    try {
        if (!access_token) {
            return new ApiResponse({
                status: 401,
                message: "Unauthorized",
                data: [access_token],
                success: false
            }).toJSON();
        }

        const updated_user = await db
            .update(users)
            .set({ about: body.about })
            .where(eq(users.id, body.id))
            .returning();

        return new ApiResponse({
            status: 200,
            message: "about updated successfully",
            data: {
                id: updated_user[0].id,
                username: updated_user[0].username,
                email: updated_user[0].email,
                about: updated_user[0].about
            },
            success: true
        }).toJSON();

    } catch (error) {
        return new ApiResponse({
            status: 500,
            message: "Error updating about.",
            data: error,
            success: false,
        }).toJSON();
    }
};