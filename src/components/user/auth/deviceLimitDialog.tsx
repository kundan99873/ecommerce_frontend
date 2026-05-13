import { Laptop, Loader2, Smartphone } from "lucide-react";
import dayjs from "dayjs";
import type { DeviceSession } from "@/services/auth/auth.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SessionFlow = "password" | "google";

interface DeviceLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: DeviceSession[];
  message?: string;
  sessionFlow: SessionFlow;
  activeDeviceId: string | null;
  isActionLoading: boolean;
  onLogoutDevice: (deviceId: string) => void;
}

const getDeviceLabel = (session: DeviceSession) => {
  const ua = session.user_agent?.toLowerCase() || "";
  const fallbackName = session.device_name?.trim() || "Unknown Device";

  if (
    ua.includes("android") ||
    ua.includes("iphone") ||
    ua.includes("mobile")
  ) {
    return "Mobile Device";
  }

  if (ua.includes("windows") || ua.includes("mac") || ua.includes("linux")) {
    return "Desktop Device";
  }

  return fallbackName;
};

const DeviceLimitDialog = ({
  open,
  onOpenChange,
  sessions,
  message,
  sessionFlow,
  activeDeviceId,
  isActionLoading,
  onLogoutDevice,
}: DeviceLimitDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Device Limit Reached</DialogTitle>
          <DialogDescription>
            {message || "You are already logged in on maximum allowed devices."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {sessions.map((session) => {
            const isMobile =
              session.user_agent?.toLowerCase().includes("android") ||
              session.user_agent?.toLowerCase().includes("iphone") ||
              session.user_agent?.toLowerCase().includes("mobile");
            const isRowLoading =
              isActionLoading && activeDeviceId === session.device_id;

            return (
              <div
                key={session.id}
                className="rounded-xl border border-border bg-card/60 p-3"
              >
                <div className="flex h-full flex-col justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {isMobile ? (
                      <Smartphone className="mt-0.5 h-4 w-4 text-primary" />
                    ) : (
                      <Laptop className="mt-0.5 h-4 w-4 text-primary" />
                    )}

                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {getDeviceLabel(session)}
                      </p>
                      <p className="break-all text-xs text-muted-foreground">
                        Last used:{" "}
                        {session.last_used_at
                          ? dayjs(session.last_used_at).format(
                              "DD MMM YYYY, hh:mm A",
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    disabled={isActionLoading}
                    onClick={() => onLogoutDevice(session.device_id)}
                  >
                    {isRowLoading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {sessionFlow === "google"
                          ? "Removing..."
                          : "Logging out..."}
                      </span>
                    ) : (
                      "Logout This Device"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isActionLoading}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceLimitDialog;
