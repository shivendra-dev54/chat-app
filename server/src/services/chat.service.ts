import { db } from "../db";
import { chats } from "../db/schemas/chats.schema";

export interface ISaveChat {
    sender_id: number;
    receiver_id: number;
    content: string;
}

export const saveChatService = async (body: ISaveChat) => {
    const chat_saved = await db
        .insert(chats)
        .values(body)
        .returning();

    return chat_saved;
};
