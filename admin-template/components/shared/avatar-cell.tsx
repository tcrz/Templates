import { Avatar, AvatarFallback, getAvatarColor, getInitials } from "@/components/ui/avatar";

interface AvatarCellProps {
  name: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AvatarCell({ name, subtitle, icon }: AvatarCellProps) {
  const initials = icon || getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback color={avatarColor}>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col capitalize">
        <span className="font-medium text-foreground">{name}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}
