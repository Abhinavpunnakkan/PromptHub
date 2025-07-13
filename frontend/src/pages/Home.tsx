import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { PromptFeed } from "../components/PromptFeed";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen p-6 pb-24">
      <SignedIn>
        <PromptFeed />

        {/* Floating Create Button */}
        <button
          onClick={() => navigate("/create")}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          title="Create New Prompt"
        >
          <Plus className="w-6 h-6" />
        </button>
      </SignedIn>

      <SignedOut>
        <div className="max-w-md mx-auto mt-20 text-center">
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
