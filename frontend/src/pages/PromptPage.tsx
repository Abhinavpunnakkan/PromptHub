import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowBigUp, Clipboard, Check } from "lucide-react";

type Prompt = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags?: string[];
  category?: string;
  models?: string[];
  upvotes?: number;
  views?: number;
};

export default function PromptPage() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/prompts/${id}`);
        const data = await res.json();
        setPrompt(data);
        setUpvoteCount(data.upvotes || 0);
      } catch (err) {
        console.error("Error fetching prompt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleCopy = () => {
    if (prompt?.content) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpvote = async () => {
    try {
      const action = upvoted ? "remove" : "upvote";
      const res = await fetch(`http://localhost:5000/api/prompts/${id}/upvote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setUpvoteCount(data.upvotes);
        setUpvoted(!upvoted);
      }
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading prompt...</p>;
  if (!prompt) return <p className="text-center mt-10 text-gray-600">Prompt not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            by <span className="font-medium">{prompt.author}</span> ·{" "}
            {new Date(prompt.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCopy} title="Copy prompt">
            {copied ? <Check size={20} className="text-green-600" /> : <Clipboard size={20} className="text-gray-500" />}
          </button>
          <button onClick={handleUpvote}>
            <ArrowBigUp
              className={`w-6 h-6 transition-colors ${
                upvoted ? "fill-black text-black" : "text-gray-400"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">{upvoteCount}</span>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-line leading-relaxed text-gray-800">
        {prompt.content}
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        {prompt.category && <p><strong>Category:</strong> {prompt.category}</p>}
        {prompt.models && prompt.models.length > 0 && (
          <p>
            <strong>Models:</strong> {prompt.models.join(", ")}
          </p>
        )}
        {prompt.tags && prompt.tags.length > 0 && (
          <p>
            <strong>Tags:</strong>{" "}
            {prompt.tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-200 px-2 py-0.5 rounded-full mr-2 text-xs">
                #{tag}
              </span>
            ))}
          </p>
        )}
        <p><strong>Views:</strong> {prompt.views ?? 0}</p>
      </div>
    </div>
  );
}
