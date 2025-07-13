import { useUser } from "@clerk/clerk-react";

export default function EditProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
      <p className="text-gray-700 mb-4">Name: {user.fullName}</p>
      <p className="text-gray-700">Email: {user.primaryEmailAddress?.emailAddress}</p>
      <p className="mt-4 text-gray-500 text-sm">
        You can customize your Clerk dashboard to enable editable fields.
      </p>
    </div>
  );
}
