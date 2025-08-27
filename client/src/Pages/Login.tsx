import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore, type IUser } from "../store/authStore";
import { axios_helper } from "../lib/api";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/community");
    }
  }, [user, navigate]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credentials.email.trim() || !validateEmail(credentials.email)) {
      toast.dismissAll();
      toast.error("Valid email is required");
      return;
    }

    if (!credentials.password || credentials.password.length < 4) {
      toast.dismissAll();
      toast.error("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios_helper({
        url: "http://localhost:64000/api/auth/login",
        method: "POST",
        credentials: true,
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      if (res.error) {
        toast.dismissAll();
        toast.error("Invalid credentials or server error");
        console.error(res.data);
        return;
      }

      const data = res.data.data;

      const user_cookie: IUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        about: data.about,
      };

      setUser(user_cookie);

      toast.dismissAll();
      toast.success("Login successful!");

      setCredentials({ email: "", password: "" });
      navigate("/community");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-6 select-none">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center animate-pulse">
          Login
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none transition"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none transition"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl shadow-lg transform transition duration-300 font-semibold text-lg flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 hover:scale-105"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
