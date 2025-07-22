import { SignIn } from "@clerk/clerk-react";

export default function AuthPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left 60%: illustration or branding */}
      <div className="w-3/5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center p-12">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to PromptNow</h1>
          <p className="text-lg opacity-90">
            Discover, share, and create the world’s most powerful AI prompts.
          </p>
        </div>
      </div>

      {/* Right 40%: Clerk SignIn */}
      <div className="w-2/5 bg-white flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <SignIn path="/home" routing="path" signUpUrl="/home" />
        </div>
      </div>
    </div>
  );
}
