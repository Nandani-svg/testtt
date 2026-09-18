import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

const variants = {
  info: { cls: "border-blue-500/30 bg-blue-500/10 text-blue-300", Icon: Info },
  success: { cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", Icon: CheckCircle2 },
  warning: { cls: "border-amber-500/30 bg-amber-500/10 text-amber-300", Icon: AlertTriangle },
  error: { cls: "border-red-500/30 bg-red-500/10 text-red-300", Icon: AlertCircle },
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export function Alert({ variant = "info", className, children, ...props }: AlertProps) {
  const { cls, Icon } = variants[variant];
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3 text-sm", cls, className)} role="alert" {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
