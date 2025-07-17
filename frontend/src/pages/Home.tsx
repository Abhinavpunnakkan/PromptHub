import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import PromptFeed from "../components/PromptFeed";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import LeftPanel from "../components/LeftPanel";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <SignedIn>
        <LeftPanel />
        <main className="flex-1 px-6 py-10">
        <PromptFeed />
      </main>
      </SignedIn>

      <SignedOut>
        <div className="max-w-md mx-auto mt-20 text-center">
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
