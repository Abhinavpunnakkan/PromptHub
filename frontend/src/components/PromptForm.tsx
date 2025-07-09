import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { ChevronDown } from "lucide-react";

export function PromptForm() {
  const { user, isLoaded } = useUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [targetModels, setTargetModels] = useState("");
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Writing",
    "Coding",
    "Art",
    "Marketing",
    "Education",
    "Business",
    "Entertainment",
  ];

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setShowCategoryDropdown(false);
  };

  const handleAddModel = () => {
    const trimmed = targetModels.trim();
    if (trimmed && !modelsList.includes(trimmed)) {
      setModelsList([...modelsList, trimmed]);
    }
    setTargetModels("");
  };

  const handleRemoveModel = (model: string) => {
    setModelsList(modelsList.filter((m) => m !== model));
  };

  const handleCancel = () => {
    setTitle("");
    setCategory("");
    setTargetModels("");
    setModelsList([]);
    setContent("");
    setIsPublic(true);
    setStatus(null);
  };

  const handleSubmit = async () => {
    if (!isLoaded || !user?.id || !title.trim() || !content.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title,
          content,
          tags: [category, ...modelsList],
          isPublic,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      handleCancel();
      setStatus("Prompt submitted!");
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-hide status message
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Prompt</h1>
          <p className="text-gray-600">
            Design and share your powerful AI prompts with the community or keep them private.
          </p>
        </div>

        <div className="space-y-8">
          {/* Prompt Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Prompt Details</h2>
            <p className="text-sm text-gray-600 mb-6">
              Provide a clear title and categorize your prompt for better discoverability.
            </p>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 'Creative Story Ideas for Sci-Fi'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  A concise and descriptive title for your prompt.
                </p>
              </div>

              {/* Category */}
              <div ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={category ? "text-gray-900" : "text-gray-500"}>
                      {category || "Select a category"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Helps users find prompts relevant to their needs.
                </p>
              </div>

              {/* Target AI Models */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target AI Models</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={targetModels}
                    onChange={(e) => setTargetModels(e.target.value)}
                    placeholder="e.g., GPT-4, MidJourney"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddModel}
                    className="px-3 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Add
                  </button>
                </div>

                {modelsList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {modelsList.map((model) => (
                      <span
                        key={model}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {model}
                        <button
                          onClick={() => handleRemoveModel(model)}
                          className="text-gray-500 hover:text-red-600 text-sm"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Specify AI models this prompt is optimized for.
                </p>
              </div>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Prompt Content</h2>
            <p className="text-sm text-gray-600 mb-6">
              Craft the core of your prompt. Be as detailed and specific as possible.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Prompt</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g., 'Generate a compelling short story...'"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include context, persona, format, or examples.
              </p>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings & Visibility</h2>
            <p className="text-sm text-gray-600 mb-6">Control who can see and use your prompt.</p>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Make Prompt Public</h3>
                <p className="text-xs text-gray-500">
                  Your prompt will be visible to everyone on PromptHub.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublic ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Saving..." : "Save Prompt"}
            </button>
          </div>

          {status && (
            <div className="text-center">
              <p className={`text-sm ${status.includes("Something") ? "text-red-600" : "text-green-600"}`}>
                {status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
