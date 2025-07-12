import { useEffect, useState } from "react";
import PromptModal from "./PromptModal";
import { ArrowBigUp } from "lucide-react";

type Prompt = {
  _id: string;
  userId: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  upvotes?: number;
};

export function PromptFeed() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prompts");
        const data = await res.json();
        setPrompts(data);
      } catch (err) {
        console.error("Failed to fetch prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const toggleUpvote = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              upvotes: (p.upvotes || 0) + (upvotedIds.has(id) ? -1 : 1),
            }
          : p
      )
    );

    setUpvotedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading prompts...</p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {prompts.map((prompt) => (
        <div
          key={prompt._id}
          className="p-5 rounded-xl shadow-sm bg-white border border-gray-200 space-y-2"
        >
          <h3 className="text-md font-semibold text-gray-900">
            {prompt.title}
          </h3>
          <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-line break-words">
            {prompt.content}
          </p>
          <p className="text-xs text-gray-500">
            By <span className="font-medium">{prompt.author}</span>
          </p>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setSelectedPrompt(prompt)}
              className="text-sm text-purple-600 hover:underline"
            >
              View Full Prompt →
            </button>
            <button
              onClick={() => toggleUpvote(prompt._id)}
              className={`flex items-center gap-1 text-sm ${
                upvotedIds.has(prompt._id) ? "text-black" : "text-gray-400"
              }`}
            >
              <ArrowBigUp
                className={`w-6 h-6 transition-colors duration-150 ${
                  upvotedIds.has(prompt._id)
                    ? "fill-black text-black"
                    : "text-gray-400"
                }`}
              />

              {prompt.upvotes || 0}
            </button>
          </div>
        </div>
      ))}

      <PromptModal
        isOpen={!!selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        prompt={selectedPrompt}
      />
    </div>
  );
}
