import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Pencil, UserCircle } from "lucide-react";

type Prompt = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
  // Add more if needed
};

export default function Profile() {
  const { user, isLoaded } = useUser();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "public" | "private" | "liked">("all");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchUserPrompts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/prompts?userId=${user.id}&filter=private`);
        const data = await res.json();
        setPrompts(data);
      } catch (err) {
        console.error("Failed to fetch user prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPrompts();
  }, [isLoaded, user]);

  const filteredPrompts = prompts.filter((prompt) => {
    if (filter === "public") return prompt.isPublic;
    if (filter === "private") return !prompt.isPublic;
    // For liked, use a separate liked list once implemented
    return true;
  });

  if (!isLoaded || !user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-14 h-14 text-gray-400" />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              {user.fullName || user.username || "Unnamed"}
            </h1>
            <button className="text-gray-500 hover:text-gray-700">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
          {/* You can later show username here */}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 flex-wrap mt-6">
        {["all", "public", "private", "liked"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`px-4 py-1 text-sm font-medium rounded-full transition ${
              filter === key
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:text-purple-600"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Prompts Section */}
      <div>
        {loading ? (
          <p className="text-gray-500">Loading your prompts...</p>
        ) : filteredPrompts.length === 0 ? (
          <p className="text-gray-500">No prompts found under this category.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt._id}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-lg text-gray-900">{prompt.title}</h3>
                <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap mt-1">
                  {prompt.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
