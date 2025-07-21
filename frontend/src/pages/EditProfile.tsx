import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";

export default function EditProfile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (username.length < 3 || username.length > 20) {
      setError("Username must be between 3 and 20 characters.");
      return;
    }
    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error updating profile.");
      } else {
        setSuccess("Username updated successfully.");
        setTimeout(() => navigate("/profile"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 max-w-xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Username</label>
          <div className="text-gray-900 font-semibold mb-2">{user?.username || "Not set"}</div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new username"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
