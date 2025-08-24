import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useAuthStore, type IUser } from "../store/authStore";
import axios from "axios";

type ChatMessage = {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
    from: "self" | "other";
};

export const Chat = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [otherUser, setOtherUser] = useState<IUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize WebSocket connection
    useEffect(() => {
        if (!user) return;

        const ws = new WebSocket("ws://localhost:64000/ws");
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");

            // Tell backend we joined
            ws.send(JSON.stringify({
                type: "join",
                userId: user.id
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "chat":
                        setMessages(prev => [...prev, data]);
                        break;
                    case "joined":
                        console.log(`Joined room: ${data.room}`);
                        break;
                    case "typing":
                        // handle typing status if needed
                        break;
                    case "error":
                        console.error("WS Error:", data.message);
                        break;
                }
            } catch (err) {
                console.error("Invalid WS message", err);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error", err);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => ws.close();
    }, [user]);

    // Fetch previous chats
    useEffect(() => {
        const fetchChatData = async () => {
            if (!user || !id) return;

            try {
                const resUser = await axios.get(`http://localhost:64000/api/user/${id}`, {
                    withCredentials: true,
                });
                setOtherUser(resUser.data.data);

                const resChats = await axios.post(
                    `http://localhost:64000/api/chat/get`,
                    {
                        sender_id: user.id,
                        receiver_id: Number(id),
                    },
                    { withCredentials: true }
                );

                const chats: ChatMessage[] = resChats.data.data.map((c: any) => ({
                    ...c,
                    from: c.sender_id === user.id ? "self" : "other",
                }));

                setMessages(chats);
            } catch (err) {
                console.error("Error fetching chat data:", err);
            }
        };

        fetchChatData();
    }, [id, user]);

    // Send message
    const sendMessage = () => {
        if (!newMessage.trim() || !user || !id || !wsRef.current) return;

        const msg = {
            type: "chat",
            sender_id: user.id,
            receiver_id: Number(id),
            content: newMessage,
        };

        wsRef.current.send(JSON.stringify(msg));
        setMessages(prev => [...prev, { ...msg, id: Date.now(), from: "self", created_at: new Date().toISOString() }]);
        setNewMessage("");
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-950 via-black to-indigo-950 flex flex-col">
            {/* Header */}
            <div className="p-4 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 border-b border-blue-400/40">
                {otherUser ? `Chat with ${otherUser.username}` : "Loading..."}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-lg p-3 rounded-2xl shadow-md ${msg.from === "self"
                            ? "ml-auto bg-cyan-500/30 text-cyan-100 border border-cyan-400/40"
                            : "mr-auto bg-blue-500/30 text-blue-100 border border-blue-400/40"
                            }`}
                    >
                        <p>{msg.content}</p>
                        <span className="block text-xs text-gray-400 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input */}
            <div className="p-4 flex space-x-3 border-t border-blue-400/40">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 p-3 rounded-2xl bg-slate-900/70 border border-blue-500/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold shadow-md hover:opacity-90 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
