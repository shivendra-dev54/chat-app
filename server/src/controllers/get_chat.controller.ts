import { eq, or, and, asc } from "drizzle-orm";
import { db } from "../db";
import { chats } from "../db/schemas/chats.schema";
import { ApiResponse } from "../utils/ApiResponse";
import { Context } from "elysia";
import * as jose from "jose";

export const get_chats_controller = async (ctx: Context) => {
    try {
        const token = ctx.cookie?.access_token?.value;

        if (!token) {
            return new ApiResponse({
                status: 401,
                message: "Unauthorized - No access token",
                data: {},
                success: false,
            }).toJSON();
        }

        // 🔑 verify access token
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
        let payload: jose.JWTPayload;
        try {
            const verified = await jose.jwtVerify(token, secret);
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

        const body = await ctx.request.json();

        if (!body || typeof body !== "object") {
            return new ApiResponse({
                status: 400,
                message: "Request body is required and must be an object",
                data: null,
                success: false,
            }).toJSON();
        }

        const { sender_id, receiver_id } = body as any;

        if (!sender_id || !receiver_id) {
            return new ApiResponse({
                status: 400,
                message: "sender_id and receiver_id are required",
                data: null,
                success: false,
            }).toJSON();
        }

        // 🔒 optional: ensure that the user making request is either sender or receiver
        if (payload.id !== sender_id && payload.id !== receiver_id) {
            return new ApiResponse({
                status: 403,
                message: "Forbidden - You are not part of this chat",
                data: null,
                success: false,
            }).toJSON();
        }

        const all_chats = await db
            .select()
            .from(chats)
            .where(
                or(
                    and(eq(chats.sender_id, sender_id), eq(chats.receiver_id, receiver_id)),
                    and(eq(chats.sender_id, receiver_id), eq(chats.receiver_id, sender_id))
                )
            )
            .orderBy(asc(chats.created_at));

        return new ApiResponse({
            status: 200,
            message: "Successfully fetched chats",
            data: all_chats,
            success: true,
        }).toJSON();
    } catch (error) {
        console.error("Error fetching chats:", error);
        return new ApiResponse({
            status: 500,
            message: "Error fetching chats",
            data: null,
            success: false,
        }).toJSON();
    }
};
