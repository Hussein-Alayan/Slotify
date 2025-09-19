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

export default function AddServiceModal({
  open,
  onClose,
  businessId,
  service = null,
}: AddServiceModalProps) {
  const dispatch = useAppDispatch();

  // form state (strings for controlled inputs)
  const [title, setTitle] = React.useState(service?.name || "");
  const [description, setDescription] = React.useState(
    service?.description || ""
  );
  const [price, setPrice] = React.useState(
    service?.price != null ? String(service.price) : ""
  );
  const [duration, setDuration] = React.useState(
    service?.duration_minutes ? String(service.duration_minutes / 60) : ""
  );
  const [status, setStatus] = React.useState(service?.status === "active");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string>("");

  function handleFileChange(file: File) {
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  // Reset form when service changes or modal re-opens
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
    setPhoto(null);
    setPhotoPreview("");
  }, [service, open]);

  // Client-side validation
  function validate() {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Service title is required.";
    if (duration && Number.isNaN(Number(duration)))
      errors.duration = "Duration must be a number (hours).";
    if (price && Number.isNaN(Number(price)))
      errors.price = "Price must be a number.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // API payload
  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  type ServicePayload = {
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    status: "active" | "inactive";
    photo_base64?: string;
  };

  async function buildPayload(): Promise<ServicePayload> {
    const payload: ServicePayload = {
      name: title.trim(),
      description: description.trim() || undefined,
      price: price === "" ? 0 : Number(price),
      duration_minutes: duration === "" ? 0 : Math.round(Number(duration) * 60),
      status: status ? "active" : "inactive",
    };
    if (photo) {
      payload.photo_base64 = await fileToBase64(photo);
    }
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = await buildPayload();

      if (service && service.id) {
        await dispatch(
          editService({
            businessId,
            serviceId: service.id,
            serviceData: payload,
          })
        );
      } else {
        await dispatch(addService({ businessId, serviceData: payload }));
      }

      setLoading(false);
      onClose();
    } catch (err: unknown) {
      setLoading(false);
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
          {service ? "Edit Service" : "Add New Service"}
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Service Name */}
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter service name"
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-gray-900"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe the service"
            />
          </div>
          {/* Service Photo */}
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-900">
              Service Photo
            </label>
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition relative"
              style={{ minHeight: 140 }}
              onClick={() =>
                document.getElementById("service-photo-input")?.click()
              }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="max-h-32 mb-2 rounded"
                />
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      width="40"
                      height="40"
                      fill="none"
                      stroke="gray"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
                      <rect x="3" y="16" width="18" height="5" rx="2" />
                    </svg>
                    <span className="mt-2 text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </div>
                </>
              )}
              <input
                id="service-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              {photoPreview && (
                <button
                  type="button"
                  className="absolute top-2 right-2 text-xs text-gray-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto(null);
                    setPhotoPreview("");
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Price & Duration */}
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

          {/* Service Status */}
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
              {loading ? "Saving..." : service ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
