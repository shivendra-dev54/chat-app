import { useCallback, useEffect, useState } from "react";
import { useAuthStore, type IUser } from "../store/authStore";
import { useNavigate } from "react-router";
import { axios_helper } from "../lib/api";

export const Community = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios_helper({
        url: "http://localhost:64000/api/user/all",
        method: "GET",
        credentials: true,
        body: {}, // GET requires empty body
      });

      if (res.error) {
        console.error("Error fetching users:", res.data);
        return;
      }

      const data = res.data.data;
      const filtered = data.filter((ele: IUser) => ele.id !== user?.id);
      setUsers(filtered || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchUsers();
    }
  }, [user, navigate, fetchUsers]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-h-screen w-full bg-transparent p-10">
      <h1 className="sm:text-6xl text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-12 animate-pulse select-none">
        🚀 Community
      </h1>

      {loading ? (
        <div className="text-center text-3xl text-white animate-bounce select-none">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-2xl text-gray-400 select-none">
          No users found 🥲
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-700/20 to-indigo-900/20 backdrop-blur-xl 
                         border border-cyan-400/40 shadow-[0_0_20px_rgba(56,189,248,0.35)] 
                         hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] 
                         transition-all duration-300"
              onClick={() => navigate(`/chat/${u.id}`)}
            >
              <h2 className="text-3xl font-bold text-blue-300 drop-shadow-lg select-none">
                {u.username}
              </h2>
              <p className="text-cyan-200">{u.email}</p>
              <p className="mt-3 text-gray-300 italic select-none ">
                {u.about || "This user is mysterious... ✨"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
