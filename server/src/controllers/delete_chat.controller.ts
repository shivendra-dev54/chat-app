import { eq } from "drizzle-orm";
import { chats } from "../db/schemas/chats.schema";
import { db } from "../db";
import { Context } from "elysia";
import { ApiResponse } from "../utils/ApiResponse";
import * as jose from "jose";

export const delete_chat_controller = async (ctx: Context) => {
    const access_token: string | undefined = ctx.cookie?.access_token?.value;

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
        let payload: jose.JWTPayload;
        try {
            const verified = await jose.jwtVerify(access_token, secret);
            payload = verified.payload;
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

        const id = Number(ctx.params.id);

        const chat = await db.select().from(chats).where(eq(chats.id, id)).limit(1);

        if (chat.length === 0) {
            return new ApiResponse({
                status: 404,
                success: false,
                message: "Chat not found",
                data: null,
            }).toJSON();
        }

        const currentUserId = payload.id as number;

        // 🔒 ensure only sender/receiver can delete
        if (chat[0].sender_id !== currentUserId && chat[0].receiver_id !== currentUserId) {
            return new ApiResponse({
                status: 403,
                success: false,
                message: "Forbidden - You cannot delete this chat",
                data: null,
            }).toJSON();
        }

        // delete chat
        const deleted = await db.delete(chats).where(eq(chats.id, id)).returning();

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
            message: "Error deleting chat",
            data: String(err),
        }).toJSON();
    }
};
