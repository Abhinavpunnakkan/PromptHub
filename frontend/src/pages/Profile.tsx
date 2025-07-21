import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Trash2, EyeOff, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";
import PromptModal from "../components/PromptModal"; // adjust path as needed


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
  upvotes?: number;
  views?: number;
  isPublic: boolean;
};

export default function Profile() {
  const { user, isLoaded } = useUser();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const navigate = useNavigate();

  const fetchPrompts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const endpoint =
        filter === "all"
          ? `http://localhost:5000/api/prompts/user/${user.id}`
          : `http://localhost:5000/api/prompts/user/${user.id}?filter=${filter}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setPrompts(data);
    } catch (err) {
      console.error("Failed to fetch user prompts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchPrompts();
    }
  }, [isLoaded, user, filter]);

  const confirmDelete = (id: string) => {
    setPromptToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!promptToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/prompts/${promptToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setPrompts((prev) => prev.filter((p) => p._id !== promptToDelete));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setShowConfirm(false);
      setPromptToDelete(null);
    }
  };

  if (!isLoaded || !user) return null;

  return (
  <div className="flex min-h-screen">
    <LeftPanel />

    <div className="flex-1 max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user.imageUrl}
          alt="Profile Pic"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            {user.fullName || user.username}
            <button
              onClick={() => navigate("/edit-profile")}
              className="text-sm text-purple-600 hover:underline"
            >
              <Pencil size={18} />
            </button>
          </h1>
          <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "public", "private"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as "all" | "public" | "private")}
            className={`px-4 py-1.5 text-sm rounded-full font-medium ${
              filter === tab
                ? "bg-purple-600 text-white"
                : "bg-transparent text-gray-600 hover:text-purple-600"
            }`}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Prompt List */}
      {loading ? (
        <p className="text-gray-500">Loading prompts...</p>
      ) : prompts.length === 0 ? (
        <p className="text-gray-500">No prompts found.</p>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              onClick={() => setSelectedPrompt(prompt)}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-900">{prompt.title}</h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    prompt.isPublic
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {prompt.isPublic ? (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <EyeOff className="w-4 h-4" /> Private
                    </span>
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
                {prompt.content}
              </p>

              <div
                className="flex justify-end mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(prompt._id);
                }}
              >
                <button className="text-red-600 hover:underline text-sm flex items-center gap-1">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this prompt? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Popup Modal */}
      <PromptModal
        isOpen={!!selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        prompt={selectedPrompt}
      />
    </div>
  </div>
);


}
 