import React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { addService, editService } from "@/store/services/servicesSlice";
import type { Service } from "@/store/services/servicesSlice";

type AddServiceModalProps = {
  open: boolean;
  onClose: () => void;
  businessId: number;
  service?: Service | null;
};

export function AddServiceModal(props: AddServiceModalProps) {
  const { open, onClose, businessId, service = null } = props;
  const dispatch = useAppDispatch();

  // form state (strings for controlled inputs)
  const [title, setTitle] = React.useState(service?.name || "");
  const [description, setDescription] = React.useState(
    service?.description || ""
  );
  const [price, setPrice] = React.useState(
    service?.price != null ? String(service.price) : ""
  );
  // duration is displayed in hours in the UI, store as string "1", "1.5", etc.
  const [duration, setDuration] = React.useState(
    service?.duration_minutes ? String(service.duration_minutes / 60) : ""
  );
  const [status, setStatus] = React.useState(service?.status === "active");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  // Reset/update form whenever the service prop or open changes
  React.useEffect(() => {
    setTitle(service?.name || "");
    setDescription(service?.description || "");
    setPrice(service?.price != null ? String(service.price) : "");
    setDuration(
      service?.duration_minutes ? String(service.duration_minutes / 60) : ""
    );
    setStatus(service?.status === "active");
    setError(null);
    setValidationErrors({});
  }, [service, open]);

  // Basic client-side validation
  function validate() {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Service title is required.";
    if (duration && Number.isNaN(Number(duration)))
      errors.duration = "Duration must be a number (hours).";
    if (price && Number.isNaN(Number(price)))
      errors.price = "Price must be a number.";
    // If you want to require duration, uncomment next line:
    // if (!duration) errors.duration = "Please select a duration.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Helper to build payload expected by your API
  function buildPayload(): {
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    status: "active" | "inactive";
  } {
    return {
      name: title.trim(),
      description: description.trim() || undefined,
      price: price === "" ? 0 : Number(price),
      duration_minutes: duration === "" ? 0 : Math.round(Number(duration) * 60),
      status: status ? "active" : "inactive",
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();

      if (service && service.id) {
        await dispatch(
          editService({
            businessId,
            serviceId: service.id,
            serviceData: payload,
          })
        );
      } else {
        await dispatch(
          addService({
            businessId,
            serviceData: payload,
          })
        );
      }

      // reset & close
      setLoading(false);
      onClose();
    } catch (err: unknown) {
      setLoading(false);

      // try to read a message from common axios-like shapes
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
      ) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Failed to save service."
        );
      } else {
        setError("Failed to save service.");
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      role="dialog"
      aria-modal="true"
      aria-label={service ? "Edit service" : "Add new service"}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {service ? "Edit Service" : "Add New Service"}
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Title
            </label>
            <input
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              placeholder="Enter your service title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!validationErrors.title}
              aria-describedby={
                validationErrors.title ? "title-error" : undefined
              }
            />
            {validationErrors.title && (
              <div id="title-error" className="text-sm text-red-600 mt-1">
                {validationErrors.title}
              </div>
            )}
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
                aria-invalid={!!validationErrors.price}
              />
              {validationErrors.price && (
                <div className="text-sm text-red-600 mt-1">
                  {validationErrors.price}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">
                Duration (Hours)
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2 text-gray-900"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                aria-invalid={!!validationErrors.duration}
              >
                <option value="">Select duration</option>
                <option value="0.5">30 minutes</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>
              {validationErrors.duration && (
                <div className="text-sm text-red-600 mt-1">
                  {validationErrors.duration}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Photo
            </label>
            {/* Simple file input. Backend upload not implemented here. */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // File handling placeholder - currently not implemented
                console.log("File selected:", e.target.files?.[0]);
              }}
            />
            <div className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </div>
            {/* TODO: If you want to upload the image, either:
                - upload to an /upload endpoint first and include returned URL in payload, or
                - send multipart/form-data in createService/updateService.
            */}
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
                aria-label="Enable service"
              />
            </div>
          </div>

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
              {loading ? "Saving..." : service ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
