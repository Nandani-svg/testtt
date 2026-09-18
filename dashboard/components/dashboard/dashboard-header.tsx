"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const pathname = usePathname();
  const inGuild = pathname.includes("/dashboard/guild/");

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Wutherer home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-sky-400 text-slate-950 shadow-sm shadow-primary/20">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:block">Wutherer</span>
        </Link>
        {inGuild && (
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-1.5 text-xs text-slate-400 hover:text-foreground transition-colors")}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All servers
          </Link>
        )}
      </div>
    </header>
  );
}
