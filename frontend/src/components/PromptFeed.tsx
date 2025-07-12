import { useEffect, useState } from "react";
import PromptModal from "./PromptModal";

type Prompt = {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  models?: string[];
  createdAt: string;
};

export function PromptFeed() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading prompts...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {prompts.map((prompt) => (
        <div
          key={prompt._id}
          className="p-4 rounded-xl shadow-md bg-white border border-gray-200"
        >
          <h3 className="font-semibold text-gray-900 mb-2">{prompt.title}</h3>
          <p className="text-gray-800 line-clamp-3">{prompt.content}</p>
          <button
            onClick={() => openModal(prompt)}
            className="mt-3 text-sm text-purple-600 hover:underline"
          >
            View Full Prompt →
          </button>
        </div>
      ))}

      {/* Modal */}
      <PromptModal
        isOpen={isModalOpen}
        onClose={closeModal}
        prompt={selectedPrompt}
      />
    </div>
  );
}
