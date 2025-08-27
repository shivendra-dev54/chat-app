import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-400">Get in Touch</h1>
          <p className="mt-2 text-gray-400">Let`s connect and build something amazing 🚀</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <FaEnvelope className="text-blue-400 text-xl" />
            <a href="mailto:devadheshivendra54@gmail.com" className="hover:underline">
              E-mail
            </a>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <FaGithub className="text-blue-400 text-xl" />
            <a
              href="https://github.com/shivendra-dev54"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <FaLinkedin className="text-blue-400 text-xl" />
            <a
              href="https://www.linkedin.com/in/shivendra-devadhe-97017a327/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <FaMapMarkerAlt className="text-blue-400 text-xl" />
            <span>Pune, Maharashtra, India</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-800">
          © {new Date().getFullYear()} Shivendra Bhaginath Devadhe. All rights reserved.
        </div>
      </div>
    </div>
  );
}
