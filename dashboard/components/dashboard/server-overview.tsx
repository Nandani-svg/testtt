"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, BarChart3, MessageSquare, Settings, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";

type OverviewData = {
  guild: any;
  automod: any | null;
  verification: any | null;
  tickets: any | null;
  ai: any | null;
  analytics: any | null;
  cases: any[] | null;
};

const moduleState = (config: any | null, label: string) => {
  if (!config) return { label: "Unavailable", variant: "default" as const };
  return { label: config.enabled === 1 ? "Enabled" : label, variant: config.enabled === 1 ? "success" as const : "default" as const };
};

export function ServerOverview() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const guild = await api.getGuildDetails(guildId);
      const results = await Promise.allSettled([
        api.getAutomodConfig(guildId),
        api.getVerificationConfig(guildId),
        api.getTicketConfig(guildId),
        api.getAIConfig(guildId),
        api.getAnalytics(guildId),
        api.getModerationCases(guildId),
      ]);
      const value = (i: number) => results[i].status === "fulfilled" ? (results[i] as any).value : null;
      setData({ guild, automod: value(0), verification: value(1), tickets: value(2), ai: value(3), analytics: value(4), cases: value(5) });
    } catch {
      setData(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (guildId) load(); }, [guildId]);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-20 rounded-lg border border-card-border bg-surface" />
      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-lg border border-card-border bg-surface" />)}
      </div>
    </div>
  );

  if (error || !data) return (
    <Card>
      <EmptyState
        icon={ShieldCheck}
        title="Server details unavailable"
        description="The bot API did not return this server's details. Confirm the bot is online, then refresh."
        action={<Button size="sm" onClick={load}>Try again</Button>}
      />
    </Card>
  );

  const { guild } = data;
  const cards = [
    {
      label: "Moderation",
      icon: ShieldCheck,
      href: `/dashboard/guild/${guildId}/moderation`,
      stat: data.cases ? `${data.cases.length} cases` : "No data",
      badge: moduleState(data.automod, "Automod off"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: `/dashboard/guild/${guildId}/analytics`,
      stat: data.analytics ? `${data.analytics.member_count ?? "—"} members` : "No data",
      badge: { label: "Live", variant: "primary" as const },
    },
    {
      label: "Tickets",
      icon: MessageSquare,
      href: `/dashboard/guild/${guildId}/tickets`,
      stat: data.tickets ? "Configured" : "Not set up",
      badge: moduleState(data.tickets, "Disabled"),
    },
    {
      label: "Verification",
      icon: Users,
      href: `/dashboard/guild/${guildId}/verification`,
      stat: data.verification ? "Configured" : "Not set up",
      badge: moduleState(data.verification, "Disabled"),
    },
    {
      label: "AI",
      icon: Settings,
      href: `/dashboard/guild/${guildId}/ai`,
      stat: data.ai ? "Configured" : "Not set up",
      badge: moduleState(data.ai, "Disabled"),
    },
  ];

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-hover text-lg font-bold text-foreground">
          {guild?.name?.[0] ?? "?"}
        </div>
        <div>
          <p className="font-semibold text-foreground">{guild?.name ?? "Unknown server"}</p>
          <p className="text-xs text-slate-400">{guild?.member_count ?? "—"} members · ID {guildId}</p>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card className="group flex flex-col gap-3 transition-colors hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary-light" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">{card.label}</span>
                  </div>
                  <Badge variant={card.badge.variant}>{card.badge.label}</Badge>
                </div>
                <p className="text-xs text-slate-400">{card.stat}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-primary-light transition-colors">
                  Manage <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
