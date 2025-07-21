import { useNavigate } from "react-router-dom";
import { Search, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white via-purple-50 to-purple-100 px-6 overflow-hidden">
      <div
        className={`text-center max-w-3xl transform transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
          The future of <br />
          <span className="text-purple-600">PromptBox</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-700 mb-10 leading-relaxed">
          Discover, curate, and share powerful AI prompts — made for developers,
          writers, creators, and the curious.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm font-medium cursor-pointer"
          >
            <Search size={18} />
            Explore Prompts
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 hover:scale-105 transition-all text-sm font-medium cursor-pointer"
          >
            <LogIn size={18} />
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
