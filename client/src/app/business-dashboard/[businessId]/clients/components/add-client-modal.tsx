import React from "react";
import { createClient } from "@/lib/clientsAPI";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  businessId: number;
}

export default function AddClientModal({
  open,
  onClose,
  businessId,
}: AddClientModalProps) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setEmail("");
      setError(null);
      setValidationErrors({});
      setLoading(false);
    }
  }, [open]);

  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!phone.trim()) errors.phone = "Phone is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await createClient(businessId, { name, phone, email });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Failed to add client.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      role="dialog"
      aria-modal="true"
      aria-label="Add new client"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Add New Client
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter client name"
            />
            {validationErrors.name && (
              <div className="text-sm text-red-600 mt-1">
                {validationErrors.name}
              </div>
            )}
          </div>
          {/* Phone */}
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Phone
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter phone number"
            />
            {validationErrors.phone && (
              <div className="text-sm text-red-600 mt-1">
                {validationErrors.phone}
              </div>
            )}
          </div>
          {/* Email */}
          <div className="mb-6">
            <label className="block font-semibold mb-1 text-gray-900">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email (optional)"
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg border font-semibold text-gray-900 bg-white hover:bg-gray-100"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
