import { Routes, Route } from "react-router";
import { Navbar } from "./Components/Navbar";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Profile } from "./Pages/Profile";
import { Community } from "./Pages/Community";
import { Homepage } from "./Pages/Homepage";
import { Toaster } from "react-hot-toast";
import Contact from "./Pages/Contact";
import { Chat } from "./Pages/Chat";

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-950 via-black to-indigo-900 text-white flex flex-col">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Navbar />
      <div className="flex-1 w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
