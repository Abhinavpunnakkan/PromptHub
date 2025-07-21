import { useUser } from "@clerk/clerk-react";
import PromptFeed from "../components/PromptFeed";
import LeftPanel from "../components/LeftPanel";

export default function Home() {

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <main className="flex-1 px-6 py-10">
        <PromptFeed />
      </main>
    </div>
  );
}
