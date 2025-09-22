import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BusinessHubContainer } from "./containers/business-hub-container";

export default function BusinessHubPage() {
  return (
    <ProtectedRoute>
      <BusinessHubContainer />
    </ProtectedRoute>
  );
}
