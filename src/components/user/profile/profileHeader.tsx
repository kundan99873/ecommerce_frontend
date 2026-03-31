import { Camera, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  memberSince: string;
  logoutLoading: boolean;
  onOpenAvatarModal: () => void;
  onLogout: () => void;
}

const ProfileHeader = ({
  name,
  email,
  avatarUrl,
  memberSince,
  logoutLoading,
  onOpenAvatarModal,
  onLogout,
}: ProfileHeaderProps) => {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="relative h-20 w-20">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-secondary">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-display font-bold text-muted-foreground">
              {name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onOpenAvatarModal}
          className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground"
          aria-label="Update profile icon"
        >
          <Camera className="h-3 w-3" />
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-display font-bold">{name}</h1>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground">
          Member since {memberSince}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="ml-auto"
        onClick={onLogout}
        disabled={logoutLoading}
      >
        {logoutLoading ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-1 h-4 w-4" />
        )}
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileHeader;
