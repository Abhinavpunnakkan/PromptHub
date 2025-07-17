import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  Clipboard,
  Check,
  X,
  ArrowBigUp,
  Eye,
  Share2,
  ExternalLink,
} from "lucide-react";

type PromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prompt: {
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
  } | null;
};

function formatViews(n = 0) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 100_000) return `${Math.floor(n / 1_000)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function PromptModal({ isOpen, onClose, prompt }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(prompt?.upvotes || 0);
  const [shareOpen, setShareOpen] = useState(false); // 🔧

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleUpvote = async () => {
    const action = upvoted ? "remove" : "upvote";
    try {
      const res = await fetch(`http://localhost:5000/api/prompts/${prompt._id}/upvote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUpvotes(data.upvotes);
        setUpvoted(!upvoted);
      }
    } catch (err) {
      console.error("Upvote toggle failed", err);
    }
  };

  const promptLink = `${window.location.origin}/prompt/${prompt._id}`;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Main Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <Dialog.Panel className="bg-white w-full max-w-5xl h-[80vh] rounded-lg shadow-xl overflow-hidden flex relative">
            {/* Close Icon */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Content */}
            <div className="w-[70%] h-full p-6 border-r border-gray-200 overflow-y-auto">
              <Dialog.Title className="text-2xl font-semibold text-gray-900 mb-4">
                {prompt.title}
              </Dialog.Title>

              <div className="relative">
                {/* Copy Icon */}
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
                  title="Copy prompt"
                >
                  {copied ? <Check size={18} /> : <Clipboard size={18} />}
                </button>

                {/* Prompt Text */}
                <div className="text-gray-800 text-sm leading-relaxed break-words whitespace-pre-line overflow-y-auto h-[400px] pr-4 border border-gray-300 rounded-md p-4 bg-gray-50 font-mono">
                  {prompt.content}
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-[30%] p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Author:</span> {prompt.author}
                </div>
                <div>
                  <span className="font-semibold">Posted:</span>{" "}
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </div>
                {prompt.category && (
                  <div>
                    <span className="font-semibold">Category:</span> {prompt.category}
                  </div>
                )}
                {Array.isArray(prompt.models) && prompt.models.length > 0 && (
                  <div>
                    <span className="font-semibold">Models:</span>{" "}
                    {prompt.models.join(", ")}
                  </div>
                )}
                {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
                  <div>
                    <span className="font-semibold">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upvotes, Views, Share */}
              <div className="mt-8 space-y-4 border-t pt-4 text-sm text-gray-600">
                {/* Upvote + Views */}
                <div className="flex items-center justify-between">
                  <button onClick={toggleUpvote} className="flex items-center gap-2">
                    <ArrowBigUp
                      className={`w-7 h-7 transition-colors duration-150 ${
                        upvoted ? "fill-black text-black" : "text-gray-400"
                      }`}
                    />
                    <span className="text-lg text-gray-900">{currentUpvotes}</span>
                  </button>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye size={16} />
                    {formatViews(prompt.views)}
                  </div>
                </div>

                {/* 🔧 Share Button */}
                <button
                  onClick={() => setShareOpen(true)}
                  className="bg-purple-600 text-white w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-purple-700 cursor-pointer transition"
                >
                  <Share2 size={16} />
                  Share Prompt
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>

        {/* 🔧 Share Modal */}
        <Transition show={shareOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setShareOpen(false)}>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white max-w-sm w-full rounded-lg shadow-lg p-6 space-y-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">Share this prompt</Dialog.Title>

                <div className="text-sm text-gray-700">
                  <p className="mb-2">Copy link to share:</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={promptLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promptLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-sm">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(promptLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={14} /> WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(promptLink)}&text=Check%20out%20this%20prompt%20on%20PromptHub!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={14} /> Twitter
                  </a>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShareOpen(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </Dialog>
    </Transition>
  );
}
