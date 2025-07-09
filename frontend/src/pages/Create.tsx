import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { PromptForm } from "../components/PromptForm";

export default function Create() {
  return (
    <div className="p-6">
      <SignedIn>
        <PromptForm />
      </SignedIn>

      <SignedOut>
        <div className="max-w-md mx-auto mt-10">
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
