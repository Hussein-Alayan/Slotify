import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, User, Phone } from "lucide-react";
import { fetchBusinesses } from "@/lib/api";

interface Business {
  id: number;
  name: string;
}

interface BusinessClientFormProps {
  businessId: string;
  clientName: string;
  clientPhone: string;
  onBusinessIdChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
  onClientPhoneChange: (value: string) => void;
  disabled?: boolean;
}

export function BusinessClientForm({
  businessId,
  clientName,
  clientPhone,
  onBusinessIdChange,
  onClientNameChange,
  onClientPhoneChange,
  disabled = false,
}: BusinessClientFormProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        setIsLoadingBusinesses(true);
        const businessData = await fetchBusinesses();
        setBusinesses(businessData);
      } catch (error) {
        console.error("Failed to load businesses:", error);
      } finally {
        setIsLoadingBusinesses(false);
      }
    }

    loadBusinesses();
  }, []);

  return (
    <div className="space-y-3">
      {/* Business Selection */}
      <div className="space-y-1">
        <Label
          htmlFor="business-select"
          className="flex items-center gap-1 text-xs font-medium"
        >
          <Building2 className="h-3 w-3 text-blue-600" />
          Business *
        </Label>
        <Select
          value={businessId}
          onValueChange={onBusinessIdChange}
          disabled={disabled || isLoadingBusinesses}
        >
          <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-8 text-sm">
            <SelectValue
              placeholder={
                isLoadingBusinesses
                  ? "Loading businesses..."
                  : "Select a business"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {businesses.map((business) => (
              <SelectItem key={business.id} value={business.id.toString()}>
                {business.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label
            htmlFor="client-name"
            className="flex items-center gap-1 text-xs font-medium"
          >
            <User className="h-3 w-3 text-blue-600" />
            Client Name *
          </Label>
          <Input
            id="client-name"
            type="text"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="e.g., John Doe"
            disabled={disabled}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="client-phone"
            className="flex items-center gap-1 text-xs font-medium"
          >
            <Phone className="h-3 w-3 text-blue-600" />
            Client Phone *
          </Label>
          <Input
            id="client-phone"
            type="tel"
            value={clientPhone}
            onChange={(e) => onClientPhoneChange(e.target.value)}
            placeholder="e.g., +1234567890"
            disabled={disabled}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
