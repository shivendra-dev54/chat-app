import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

export const Profile = () => {
    const { user, update_user } = useAuthStore();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<{
        id: number;
        username: string;
        email: string;
        about: string;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [about, setAbout] = useState("");

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            setProfile(user);
            setAbout(user.about || "");
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateAbout = async () => {
        if (!about.trim()) return;

        try {
            const res = await axios.post(
                "http://localhost:64000/api/user/update_about",
                {
                    ...user,
                    about: about,
                },
                {
                    withCredentials: true, // same as credentials: "include"
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.data;
            update_user({
                id: data.data.id,
                username: data.data.username,
                email: data.data.email,
                about: data.data.about
            });

            if (data.success) {
                setProfile((prev) => prev ? { ...prev, about } : prev);
                setEditMode(false); // close popup after update
            }
        } catch (error) {
            console.error("Error updating about:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            fetchProfile();
        }
    }, [user, navigate, fetchProfile]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-950 via-black to-indigo-900 p-10">
            <h1 className="sm:text-6xl text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-12 animate-pulse select-none">
                👤 Profile
            </h1>

            {loading ? (
                <div className="text-center text-3xl text-white animate-bounce select-none">
                    Loading profile...
                </div>
            ) : !profile ? (
                <div className="text-center text-2xl text-gray-400 select-none">
                    Profile not found 🥲
                </div>
            ) : (
                <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-700/20 to-indigo-900/20 backdrop-blur-xl 
                                border border-cyan-400/40 shadow-[0_0_20px_rgba(56,189,248,0.35)] 
                                hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] 
                                transition-all duration-300">
                    <h2 className="text-3xl font-bold text-blue-300 drop-shadow-lg mb-4 select-none">
                        {profile.username}
                    </h2>
                    <p className="text-cyan-200 mb-2">{profile.email}</p>
                    <p className="text-gray-300 italic mb-6 select none">
                        {profile.about || "You haven`t written anything about yourself yet... ✨"}
                    </p>

                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold select-none  
                                       hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.45)]"
                        >
                            Edit About ✍️
                        </button>
                    ) : (
                        <div className="mt-4 flex flex-col space-y-4">
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full p-3 select-none  rounded-lg bg-black/40 border border-cyan-400/40 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300"
                                placeholder="Update your about section..."
                            />
                            <div className="flex space-x-4">
                                <button
                                    onClick={updateAbout}
                                    className="flex-1 px-6 select-none  py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold 
                                               hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.45)]"
                                >
                                    Save ✅
                                </button>
                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        setAbout(profile.about || "");
                                    }}
                                    className="flex-1 px-6 select-none  py-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold 
                                               hover:from-gray-500 hover:to-gray-700 transition-all duration-300"
                                >
                                    Cancel ❌
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
