
/**
 * Safely extracts an error message from an unknown error object (e.g., Axios or fetch error).
 * Falls back to a default message if not found.
 */
export function getErrorMessage(err: unknown, fallback = "An error occurred"): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data &&
    typeof err.response.data.message === "string"
  ) {
    return err.response.data.message;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
