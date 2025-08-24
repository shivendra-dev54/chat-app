import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export const Homepage = () => {

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/community");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white items-center justify-center px-6 select-none">

      <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse text-center">
        Welcome to Chat
      </h1>

      <p className="text-lg mb-12 text-gray-300 max-w-xl text-center leading-relaxed">
        A minimalistic, dark-themed chat app designed for smooth, real-time conversations. Login or register to join the chat community.
      </p>

      <div className="flex gap-6">
        <Link
          to="/auth/login"
          className="px-8 py-4 bg-blue-600 rounded-xl shadow-lg hover:bg-blue-500 hover:scale-105 transform transition duration-300 ease-in-out text-lg font-semibold flex items-center justify-center gap-2"
        >
          <span>Login</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>

        <Link
          to="/auth/register"
          className="px-8 py-4 bg-gray-700 rounded-xl shadow-lg hover:bg-gray-600 hover:scale-105 transform transition duration-300 ease-in-out text-lg font-semibold flex items-center justify-center gap-2"
        >
          <span>Register</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      <p className="mt-10 text-gray-500 text-sm">
        Made with ❤️ using React & TailwindCSS
      </p>
    </div>
  );
};
