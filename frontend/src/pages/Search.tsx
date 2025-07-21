import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { Eye, ArrowBigUp, X } from "lucide-react";
import PromptModal from "../components/PromptModal";
import LeftPanel from "../components/LeftPanel";

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

export default function SearchPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filtered, setFiltered] = useState<Prompt[]>([]);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  // Fetch all prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/prompts");
        const data = await res.json();
        setPrompts(data);
        setFiltered(data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // Search Logic
  const applySearch = (input: string) => {
    const q = input.trim().toLowerCase();

    if (!q) {
      setFiltered(prompts);
      return;
    }

    let results: Prompt[] = [];

    if (q.startsWith("[") && q.endsWith("]")) {
      // Tag search
      const tag = q.slice(1, -1);
      results = prompts.filter(
        (p) => p.tags?.some((t) => t.toLowerCase().includes(tag))
      );
    } else if (q.startsWith("user:")) {
      const name = q.split("user:")[1];
      results = prompts.filter((p) =>
        p.author?.toLowerCase().includes(name)
      );
    } else if (q.startsWith('"') && q.endsWith('"')) {
      const phrase = q.slice(1, -1);
      results = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(phrase) ||
          p.content.toLowerCase().includes(phrase)
      );
    } else {
      results = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    setFiltered(results);
  };

  const debouncedSearch = useMemo(() => debounce(applySearch, 300), [prompts]);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-10">
        {/* Search Input */}
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applySearch(query);
              }
            }}
            placeholder="Search prompts..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}

          {/* Tips dropdown */}
          {focused && !query && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow p-3 text-sm text-gray-500 z-10">
              <p className="mb-1 text-gray-600 font-medium">Search Tips:</p>
              <ul className="space-y-1">
                <li>
                  <code>[tag]</code> search within a tag
                </li>
                <li>
                  <code>user:name</code> search by author
                </li>
                <li>
                  <code>"exact phrase"</code> match exact words
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Search Results */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h1>

        {loading ? (
          <div className="text-gray-500">Loading prompts...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500">No prompts found.</div>
        ) : (
          <div className="space-y-6">
            {filtered.map((prompt) => (
              <div
                key={prompt._id}
                onClick={() => setSelectedPrompt(prompt)}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{prompt.title}</h2>
                  <span className="text-xs text-gray-500">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                  {prompt.content}
                </p>

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

        {/* Prompt Modal */}
        <PromptModal
          isOpen={!!selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          prompt={selectedPrompt}
        />
      </div>
    </div>
  );
}
