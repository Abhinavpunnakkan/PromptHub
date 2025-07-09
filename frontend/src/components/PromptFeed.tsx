import { useEffect, useState } from "react";
import { ThumbsUp, ArrowRight } from "lucide-react";

type Prompt = {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
};

export function PromptFeed() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prompts");
        const data = await res.json();

        // Only keep public prompts
        const publicPrompts = data.filter((p: Prompt) => p.isPublic);
        setPrompts(publicPrompts);
      } catch (err) {
        console.error("Failed to fetch prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading prompts...</p>;

  if (!prompts.length)
    return (
      <p className="text-center mt-10 text-gray-500">
        No public prompts found. Be the first to create one!
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <div
            key={prompt._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{prompt.title}</h3>

            {/* Content Preview */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-4">
              {prompt.content.length > 150
                ? prompt.content.slice(0, 150) + "..."
                : prompt.content}
            </p>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs mb-4">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="font-mono">By: {prompt.userId.slice(0, 6)}...</span>

              <div className="flex items-center gap-3">
                {/* Upvote button (non-functional for now) */}
                <button className="flex items-center gap-1 hover:text-purple-600 transition">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Upvote</span>
                </button>

                {/* View full prompt */}
                <button className="flex items-center gap-1 text-purple-600 hover:underline">
                  <span>View Full</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
