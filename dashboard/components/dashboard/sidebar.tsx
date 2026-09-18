"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Shield, ShieldAlert, Sliders, Award, Ticket,
  Bot, Terminal, Settings, BarChart3, MessageSquare, UserPlus, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  guildId: string;
}

const sections = (guildId: string) => [
  {
    label: "Control center",
    links: [
      { name: "Overview", href: `/dashboard/guild/${guildId}`, icon: LayoutDashboard },
      { name: "Analytics", href: `/dashboard/guild/${guildId}/analytics`, icon: BarChart3 },
    ],
  },
  {
    label: "Safety",
    links: [
      { name: "Moderation", href: `/dashboard/guild/${guildId}/moderation`, icon: Shield },
      { name: "Automod", href: `/dashboard/guild/${guildId}/automod`, icon: Sliders },
      { name: "Antinuke", href: `/dashboard/guild/${guildId}/antinuke`, icon: ShieldAlert },
      { name: "Verification", href: `/dashboard/guild/${guildId}/verification`, icon: ShieldCheck },
    ],
  },
  {
    label: "Engagement",
    links: [
      { name: "Onboarding", href: `/dashboard/guild/${guildId}/onboarding`, icon: UserPlus },
      { name: "Leveling", href: `/dashboard/guild/${guildId}/leveling`, icon: Award },
      { name: "Tickets", href: `/dashboard/guild/${guildId}/tickets`, icon: Ticket },
    ],
  },
  {
    label: "Automation",
    links: [
      { name: "Auto-responder", href: `/dashboard/guild/${guildId}/autoresponder`, icon: MessageSquare },
      { name: "AI", href: `/dashboard/guild/${guildId}/ai`, icon: Bot },
      { name: "Custom commands", href: `/dashboard/guild/${guildId}/automation`, icon: Terminal },
    ],
  },
  {
    label: "Configuration",
    links: [
      { name: "Settings", href: `/dashboard/guild/${guildId}/settings`, icon: Settings },
    ],
  },
];

export function Sidebar({ guildId }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-card-border bg-surface">
      <nav className="flex-1 overflow-y-auto py-4">
        {sections(guildId).map((section) => (
          <div key={section.label} className="mb-4 px-3">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {section.label}
            </p>
            {section.links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-primary-subtle text-primary-light font-medium"
                      : "text-slate-400 hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
