import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

export default function SignInPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("redirect") || "/";

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-3/5 bg-gradient-to-br from-purple-600 to-pink-500 text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-extrabold mb-4">PromptHub</h1>
        <p className="text-lg text-purple-100">
          Create, share, and discover powerful AI prompts.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <SignIn redirectUrl={redirectUrl} />
        </div>
      </div>
    </div>
  );
}
