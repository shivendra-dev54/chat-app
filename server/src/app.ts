import { Elysia } from "elysia";
import { auth_router } from "./routes/auth.route";
import { chat_router } from "./routes/chat.route";
import { ApiResponse } from "./utils/ApiResponse";
import { saveChatService } from "./services/chat.service";
import cors from "@elysiajs/cors";
import { cookie } from '@elysiajs/cookie'
import { user_router } from "./routes/user.route";

const connectedUsers = new Map<number, any>();

export const app = new Elysia()
    .use(cookie())
    .use(cors({
        origin: process.env.CLIENT_URL!,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true
    }))
    .onAfterHandle(({ response, set }) => {
        const res = response as ApiResponse;
        set.status = res?.status ?? 200;
    })
    .group("/api", (app) =>
        app
            .use(auth_router)
            .use(chat_router)
            .use(user_router)
    )
    .ws("/ws", {
        message: async (ws, message: any) => {
            let data;
            try {
                if (typeof message === "string") {
                    data = JSON.parse(message);
                } else {
                    data = message;
                }
                console.log("Received message:", data);

                switch (data.type) {
                    case "join":
                        const userId = data.userId;
                        if (!userId || typeof userId !== 'number') {
                            ws.send(JSON.stringify({
                                type: "error",
                                message: "Invalid user ID"
                            }));
                            return;
                        }

                        // Store the connection
                        connectedUsers.set(userId, ws);
                        console.log(`User ${userId} joined their room`);

                        ws.send(JSON.stringify({
                            type: "joined",
                            userId,
                            room: `user:${userId}`
                        }));
                        break;

                    case "chat":
                        const { sender_id, receiver_id, content } = data;

                        if (!sender_id || !receiver_id || !content?.trim()) {
                            ws.send(JSON.stringify({
                                type: "error",
                                message: "Invalid chat data"
                            }));
                            return;
                        }

                        // Save the chat message
                        const [chat] = await saveChatService({
                            sender_id,
                            receiver_id,
                            content: content.trim(),
                        });

                        // Send to receiver
                        const receiverWs = connectedUsers.get(receiver_id);
                        if (receiverWs) {
                            receiverWs.send(JSON.stringify({
                                type: "chat",
                                ...chat,
                                from: "other"
                            }));
                        }

                        console.log(`Chat message from ${sender_id} to ${receiver_id}`);
                        break;

                    case "typing":
                        const { userId: typingUserId, receiverId, isTyping } = data;

                        // Send typing status to receiver
                        const typingReceiverWs = connectedUsers.get(receiverId);
                        if (typingReceiverWs) {
                            typingReceiverWs.send(JSON.stringify({
                                type: "typing",
                                userId: typingUserId,
                                isTyping
                            }));
                        }
                        break;

                    default:
                        ws.send(JSON.stringify({
                            type: "error",
                            message: "Unknown message type"
                        }));
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Failed to process message"
                }));
            }
        },
        open: (ws) => {
            console.log(`WebSocket connection opened`);
        },
        close: (ws) => {
            // Remove user from connected users when they disconnect
            for (const [userId, userWs] of connectedUsers.entries()) {
                if (userWs === ws) {
                    connectedUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        },
        error: (error) => {
            console.error("WebSocket error:", error);
        }
    });

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    app.stop();
    process.exit(0);
});