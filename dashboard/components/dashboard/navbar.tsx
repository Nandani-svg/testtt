"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-card-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-sky-400 text-slate-950 shadow-sm shadow-primary/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Wutherer</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
          <a href="#product" className="hover:text-foreground transition-colors">Product</a>
          <a href="#capabilities" className="hover:text-foreground transition-colors">Capabilities</a>
        </nav>
        <Link href="/dashboard">
          <Button size="sm" className="gap-1.5">
            Open dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
