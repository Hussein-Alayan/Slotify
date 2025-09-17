import React from "react";
import { createService } from "@/lib/servicesAPI";

type AddServiceModalProps = {
  open: boolean;
  onClose: () => void;
  businessId: number;
  onSuccess?: () => void;
};

export function AddServiceModal({
  open,
  onClose,
  businessId,
  onSuccess,
}: AddServiceModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [duration, setDuration] = React.useState("");
  // Removed availableHours state
  const [status, setStatus] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createService(businessId, {
        name: title,
        duration_minutes: Number(duration) * 60,
        price: Number(price),
        description,
        status: status ? "active" : "inactive",
      });
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      setLoading(false);
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || "Failed to add service.");
      } else {
        setError("Failed to add service.");
      }
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Add New Service
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Title
            </label>
            <input
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              placeholder="Enter your service title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              rows={3}
              placeholder="Describe your service in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">
                Price
              </label>
              <input
                className="w-full border rounded-lg px-4 py-2 text-gray-900"
                type="number"
                min="0"
                step="0.01"
                placeholder="$ 0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">
                Duration (Hours)
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2 text-gray-900"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="">Select duration</option>
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Photo
            </label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-600">
              <span className="mb-2">&#8682;</span>
              <span>Click to upload or drag and drop</span>
              <span className="text-xs mt-1">PNG, JPG, GIF up to 10MB</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Status
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                Enable or disable this service for booking
              </span>
              <input
                type="checkbox"
                className="ml-2"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg border font-semibold text-gray-900 bg-white hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
