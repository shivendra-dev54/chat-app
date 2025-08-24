import { Elysia, t } from "elysia";
import { delete_chat_controller } from "../controllers/delete_chat.controller";
import { get_chats_controller } from "../controllers/get_chat.controller";

export const chat_router = new Elysia({ prefix: "/chat" })
    .post("/get", get_chats_controller)
    .delete(
        "/delete/:id",
        delete_chat_controller,
        {
            params: t.Object({
                id: t.String(),
            }),
        }
    );