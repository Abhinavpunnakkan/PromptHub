import { useEffect, useState } from "react";
import { Eye, ArrowBigUp, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftPanel from "./LeftPanel";
import PromptModal from "./PromptModal";

type Prompt = {
  _id: string;
  userId: string;
  title: string;
  content: string;
  author: string;
  tags?: string[];
  category?: string;
  models?: string[];
  upvotes?: number;
  views?: number;
  createdAt: string;
};

function formatViews(n = 0) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 100_000) return `${Math.floor(n / 1_000)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function PromptFeed() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Access search from navbar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchQuery(query);
    if (query) {
      performSearch(query);
      setSearchPerformed(true);
    } else {
      setFilteredPrompts(prompts);
      setSearchPerformed(false);
    }
  }, [location.search, prompts]);

  useEffect(() => {
    fetch("http://localhost:5000/api/prompts")
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data);
        setFilteredPrompts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch prompts", err);
        setLoading(false);
      });
  }, []);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPrompts(prompts);
      return;
    }

    setSearching(true);
    const lower = query.toLowerCase();

    const results = prompts.filter((p) => {
      if (lower.startsWith("[") && lower.endsWith("]")) {
        const tag = lower.slice(1, -1);
        return p.tags?.some((t) => t.toLowerCase() === tag);
      }

      if (lower.startsWith("user:")) {
        const username = lower.slice(5).trim();
        return p.author?.toLowerCase().includes(username);
      }

      if (lower.startsWith("collective:\"") && lower.endsWith("\"")) {
        const name = lower.slice(12, -1);
        return p.category?.toLowerCase() === name;
      }

      if (lower.startsWith("\"") && lower.endsWith("\"")) {
        const exact = lower.slice(1, -1);
        return (
          p.title.toLowerCase().includes(exact) ||
          p.content.toLowerCase().includes(exact)
        );
      }

      return (
        p.title.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower) ||
        p.author?.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
      );
    });

    setFilteredPrompts(results);
    setSearching(false);
  };

  const handleCreatePrompt = () => navigate("/create");

  return (
  <div className="max-w-4xl mx-auto px-4 py-8">
    {/* Header + Create Button */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">
        {searchPerformed ? "Search Results" : "Interesting prompts for you"}
      </h1>
      <button
        onClick={handleCreatePrompt}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
      >
        <Plus size={16} />
        Create
      </button>
    </div>

    {loading || searching ? (
      <div className="text-center py-10 text-gray-500">Loading prompts...</div>
    ) : filteredPrompts.length === 0 ? (
      <div className="text-center py-10 text-gray-500">No prompts found.</div>
    ) : (
      <div className="space-y-6">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt._id}
            onClick={() => setSelectedPrompt(prompt)}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{prompt.title}</h2>
              <span className="text-xs text-gray-500">
                {new Date(prompt.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-3 mb-3">{prompt.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {prompt.author}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {formatViews(prompt.views)}
                </span>
                <span className="flex items-center gap-1">
                  <ArrowBigUp size={16} /> {prompt.upvotes || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Modal */}
    <PromptModal
      isOpen={!!selectedPrompt}
      onClose={() => setSelectedPrompt(null)}
      prompt={selectedPrompt}
    />
  </div>
);

}
