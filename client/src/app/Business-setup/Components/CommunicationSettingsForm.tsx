import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type Notifications = {
  newBooking: boolean;
  cancellation: boolean;
  reschedule: boolean;
  reminder: boolean;
};

export type CommunicationSettings = {
  whatsappApiKey: string;
  autoReplyEnabled: boolean;
  responseStyle: string;
  notifications: Notifications;
};

interface CommunicationSettingsFormProps {
  communicationSettings: CommunicationSettings;
  setCommunicationSettings: (settings: CommunicationSettings) => void;
}

export function CommunicationSettingsForm({
  communicationSettings,
  setCommunicationSettings,
}: CommunicationSettingsFormProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200">
          <svg
            className="h-4 w-4 text-slate-900"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2a4 4 0 014-4h3m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h3"
            />
          </svg>
        </span>
        <div>
          <h2 className="text-xl font-semibold">Communication / AI Settings</h2>
          <p className="text-gray-600">
            Configure automated messaging and notifications
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <Label>WhatsApp / Social API Key</Label>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={communicationSettings.whatsappApiKey}
            onChange={(e) =>
              setCommunicationSettings({
                ...communicationSettings,
                whatsappApiKey: e.target.value,
              })
            }
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Credentials for AI to send messages
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-Reply Enabled</Label>
            <p className="text-sm text-gray-500">
              Enable automatic responses to client messages
            </p>
          </div>
          <Switch
            checked={communicationSettings.autoReplyEnabled}
            onCheckedChange={(checked) =>
              setCommunicationSettings({
                ...communicationSettings,
                autoReplyEnabled: checked,
              })
            }
          />
        </div>
        <div>
          <Label>Preferred Response Style</Label>
          <Select
            value={communicationSettings.responseStyle}
            onValueChange={(value) =>
              setCommunicationSettings({
                ...communicationSettings,
                responseStyle: value,
              })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select response style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-base font-medium mb-4 block">
            Notification Settings
          </Label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>New Booking</span>
              <Switch
                checked={communicationSettings.notifications.newBooking}
                onCheckedChange={(checked) =>
                  setCommunicationSettings({
                    ...communicationSettings,
                    notifications: {
                      ...communicationSettings.notifications,
                      newBooking: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Cancellation</span>
              <Switch
                checked={communicationSettings.notifications.cancellation}
                onCheckedChange={(checked) =>
                  setCommunicationSettings({
                    ...communicationSettings,
                    notifications: {
                      ...communicationSettings.notifications,
                      cancellation: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Reschedule</span>
              <Switch
                checked={communicationSettings.notifications.reschedule}
                onCheckedChange={(checked) =>
                  setCommunicationSettings({
                    ...communicationSettings,
                    notifications: {
                      ...communicationSettings.notifications,
                      reschedule: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Reminder</span>
              <Switch
                checked={communicationSettings.notifications.reminder}
                onCheckedChange={(checked) =>
                  setCommunicationSettings({
                    ...communicationSettings,
                    notifications: {
                      ...communicationSettings.notifications,
                      reminder: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
