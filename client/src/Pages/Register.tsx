import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { axios_helper } from "../lib/api";

export const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const [_user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });


    useEffect(() => {
        if (user) {
            navigate("/community");
        }
    }, [user, navigate]);


    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!_user.username.trim()) {
            toast.dismissAll();
            toast.error("Username is required");
            return;
        }
        if (!_user.email.trim() || !validateEmail(_user.email)) {
            toast.dismissAll();
            toast.error("Valid email is required");
            return;
        }
        if (!_user.password || _user.password.length < 4) {
            toast.dismissAll();
            toast.error("Password must be at least 4 characters");
            return;
        }

        setLoading(true);

        try {
            const url = "http://localhost:64000/api/auth/register";

            const res = await axios_helper({
                url,
                method: "POST",
                credentials: true,
                body: {
                    username: _user.username,
                    email: _user.email,
                    password: _user.password,
                },
            });

            if (res.error) {
                toast.dismissAll();
                toast.error("Registration failed");
                console.error("Error:", res.data);
                return;
            }

            toast.dismissAll();
            toast.success("Registration successful 🎉");

            setUser({
                username: "",
                email: "",
                password: "",
            });

            navigate("/auth/login");
        } catch (err: unknown) {
            console.error("Unexpected Error:", err);
            toast.dismissAll();
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-6 select-none">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
                <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center animate-pulse">
                    Register
                </h1>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none transition"
                        value={_user.username}
                        onChange={(e) => setUser({ ..._user, username: e.target.value })}
                        disabled={loading}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none transition"
                        value={_user.email}
                        onChange={(e) => setUser({ ..._user, email: e.target.value })}
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none transition"
                        value={_user.password}
                        onChange={(e) => setUser({ ..._user, password: e.target.value })}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-xl shadow-lg transform transition duration-300 font-semibold text-lg flex items-center justify-center gap-2
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:scale-105"}`}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        )}
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-gray-400 text-center">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};
