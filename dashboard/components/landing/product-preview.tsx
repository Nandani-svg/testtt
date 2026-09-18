"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bot, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const views = {
  safety: {
    label: "Safety",
    icon: ShieldCheck,
    title: "Keep changes visible",
    description: "Review moderation activity, tune filters, and reach anti-nuke controls from one focused workspace.",
    rows: ["Moderation case history", "Message filter controls", "Verification settings"],
  },
  automation: {
    label: "Automation",
    icon: Zap,
    title: "Make repeated work predictable",
    description: "Configure custom commands and response triggers with live lists that reflect what your bot has stored.",
    rows: ["Custom command library", "Auto-responder triggers", "YouTube upload alerts"],
  },
  community: {
    label: "Community",
    icon: Bot,
    title: "Set up a better arrival",
    description: "Give new members a clearer first path with onboarding, tickets, and optional AI assistance.",
    rows: ["Onboarding messages", "Support ticket settings", "AI channel controls"],
  },
} as const;

type ViewKey = keyof typeof views;

export function ProductPreview() {
  const [active, setActive] = useState<ViewKey>("safety");
  const view = views[active];
  const Icon = view.icon;

  return (
    <section className="overflow-hidden rounded-xl border border-card-border bg-card shadow-2xl shadow-black/20" aria-label="Product preview">
      <div className="flex items-center gap-1 border-b border-card-border px-4 py-3">
        {(Object.keys(views) as ViewKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              active === key ? "bg-surface-hover text-foreground" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {views[key].label}
          </button>
        ))}
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary-light" aria-hidden="true" />
          <span className="text-sm font-semibold text-foreground">{view.title}</span>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-slate-400">{view.description}</p>
        <ul className="space-y-2">
          {view.rows.map((row) => (
            <li key={row} className="flex items-center gap-2 rounded-md border border-card-border bg-surface px-3 py-2 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {row}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-card-border px-5 py-3">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-primary-light hover:underline">
          Open your dashboard <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
