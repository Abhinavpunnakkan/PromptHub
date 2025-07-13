import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Prompt = {
  _id: string;
  userId: string;
  author: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  models?: string[];
  createdAt: string;
  isPublic: boolean;
  upvotes?: number;
};

export default function Profile() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filter, setFilter] = useState<"all" | "private">("all");

  const fetchMyPrompts = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/prompts/user/${user.id}`);
      const data = await res.json();
      setPrompts(data);
    } catch (err) {
      console.error("Failed to fetch your prompts", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;

    const confirmed = window.confirm("Are you sure you want to delete this prompt?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/prompts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setPrompts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete prompt", err);
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchMyPrompts();
  }, [isSignedIn]);

  if (!isLoaded) return null;

  const filtered = filter === "private" ? prompts.filter((p) => !p.isPublic) : prompts;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">My Prompts</h1>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full border ${
            filter === "all" ? "bg-black text-white" : "border-gray-300 text-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full border ${
            filter === "private" ? "bg-black text-white" : "border-gray-300 text-gray-700"
          }`}
          onClick={() => setFilter("private")}
        >
          Private Only
        </button>
      </div>

      {/* Prompt Cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No prompts found.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((prompt) => (
            <div
              key={prompt._id}
              className="bg-white border border-gray-200 p-4 rounded-md shadow-sm relative"
            >
              <h2 className="text-lg font-semibold text-gray-900">{prompt.title}</h2>
              <p className="text-gray-700 text-sm mt-1 whitespace-pre-line line-clamp-4">
                {prompt.content}
              </p>

              <div className="text-xs text-gray-500 mt-3 flex justify-between items-center">
                <span>{prompt.isPublic ? "Public" : "Private"} • {new Date(prompt.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(prompt._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
