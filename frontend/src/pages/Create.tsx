import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { PromptForm } from "../components/PromptForm";
import { Link } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";

export default function Create() {
  return (
    <div className="flex min-h-screen">
      <SignedIn>
        <LeftPanel />
                <main className="flex-1">
                <PromptForm />
              </main>
      </SignedIn>

      <SignedOut>
        <div className="max-w-md mx-auto mt-10">
          <div className="text-center text-gray-700">
            <p>
  You need to{" "}
  <Link to="/sign-in?redirect=/create" className="font-semibold underline text-purple-600">
  sign in
</Link>{" "}
  to create a prompt.
</p>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
