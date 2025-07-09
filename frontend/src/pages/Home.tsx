import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { PromptFeed } from "../components/PromptFeed";

export default function Home() {
  return (
    <div className="p-6">
      <SignedIn>
        <PromptFeed />
      </SignedIn>

      <SignedOut>
        <div className="max-w-md mx-auto mt-10">
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
