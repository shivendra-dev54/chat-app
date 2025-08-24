import { eq } from "drizzle-orm";
import { chats } from "../db/schemas/chats.schema";
import { db } from "../db";
import { Context } from "elysia";
import { ApiResponse } from "../utils/ApiResponse";


export const delete_chat_controller = async (ctx: Context) => {
    try {

        if (!ctx.cookie.access_token.value) {
            return new ApiResponse({
                status: 401,
                message: "Unauthorized",
                data: [ctx.cookie],
                success: false
            }).toJSON();
        }

        const id = Number(ctx.params.id);

        const deleted = await db
            .delete(chats)
            .where(eq(chats.id, id))
            .returning();

        if (!deleted.length) {
            ctx.set.status = 404;
            return {
                status: 404,
                success: false,
                message: "Chat not found",
            };
        }

        return new ApiResponse({
            status: 200,
            success: true,
            message: "Chat deleted successfully",
            data: deleted[0],
        }).toJSON();
    } catch (err) {
        return new ApiResponse({
            status: 500,
            success: false,
            data: String(err),
            message: "Error deleting chat",
        }).toJSON();
    }
}