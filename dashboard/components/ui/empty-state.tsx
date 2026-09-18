import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: any;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-10 text-center", className)} {...props}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-surface">
        <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
