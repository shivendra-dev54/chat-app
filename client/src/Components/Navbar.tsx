import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const isLoggedIn = Boolean(user);

  const handleLogout = async () => {
    try {
      await logout();
      toast.dismiss();
      toast.success("Logged out!");
      navigate("/");
    } catch (err) {
      toast.dismiss();
      toast.error("Unable to log out");
      console.error(err);
    } finally {
      setUserMenuOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="w-full bg-gray-900 text-white flex items-center justify-between px-6 h-16 shadow-md relative select-none">
      {/* Logo */}
      <button
        className="text-xl font-bold text-blue-400 hover:cursor-pointer"
        onClick={() => navigate(isLoggedIn ? "/community" : "/")}
      >
        Chat
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          to={isLoggedIn ? "/community" : "/"}
          className="hover:text-blue-300 transition font-medium"
        >
          Home
        </Link>

        <Link
          to="/contact"
          className="hover:text-blue-300 transition font-medium"
        >
          Contact
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/auth/login"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition font-semibold"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
            >
              <FaUserCircle className="text-2xl text-white" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-xl shadow-lg py-2 flex flex-col z-50">
                <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-gray-700 transition rounded-lg"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 hover:bg-gray-700 transition rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col w-6 h-6 justify-between items-center gap-1"
        >
          <span className="h-0.5 w-full bg-white rounded" />
          <span className="h-0.5 w-full bg-white rounded" />
          <span className="h-0.5 w-full bg-white rounded" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-gray-900 shadow-md flex flex-col z-40 overflow-hidden transition-max-height duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <Link
          to={isLoggedIn ? "/community" : "/"}
          className="px-6 py-4 hover:bg-gray-800 transition border-b border-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/contact"
          className="px-6 py-4 hover:bg-gray-800 transition border-b border-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/auth/login"
            className="px-6 py-4 hover:bg-gray-800 transition border-b border-gray-700"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/profile"
              className="px-6 py-4 hover:bg-gray-800 transition border-b border-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-left px-6 py-4 hover:bg-gray-800 transition border-b border-gray-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
