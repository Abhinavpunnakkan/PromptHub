import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Clipboard, Check, X } from "lucide-react";

type PromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prompt: {
    _id: string;
    userId: string;
    title: string;
    content: string;
    tags?: string[];
    category?: string;
    models?: string[];
    createdAt: string;
    upvotes?: number;
  } | null;
};

export default function PromptModal({ isOpen, onClose, prompt }: PromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <Dialog.Panel className="bg-white w-full max-w-5xl h-[80vh] rounded-lg shadow-xl overflow-hidden flex relative">
            {/* Close Icon */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Prompt content */}
            <div className="w-[70%] h-[150vh] p-6 border-r border-gray-200 overflow-y-auto">
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

  {/* Prompt Text Box */}
  <div className="text-gray-800 text-sm leading-relaxed break-words whitespace-pre-line overflow-y-auto h-[400px] pr-4 border border-gray-300 rounded-md p-4 bg-gray-50 font-mono">
    {prompt.content}
  </div>
</div>

</div>


            {/* Right: Metadata */}
            <div className="w-[30%] p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Author:</span> {prompt.userId}
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

              {/* Upvote Display */}
              <div className="mt-8 text-center border-t pt-4 text-sm text-gray-500">
                <strong className="text-purple-600">{prompt.upvotes || 0}</strong>{" "}
                upvotes
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
