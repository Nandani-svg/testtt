"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Server, Terminal, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";

export default function DashboardServerSelector() {
  const [guilds, setGuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const loadGuilds = () => {
    setLoading(true);
    setError(false);
    api.getGuilds()
      .then((data) => setGuilds(data))
      .catch(() => { setGuilds([]); setError(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadGuilds(); }, []);

  const visibleGuilds = useMemo(() => {
    const term = query.trim().toLowerCase();
    return guilds.filter((g) => !term || g.name.toLowerCase().includes(term));
  }, [guilds, query]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <SectionHeader
        title="Your servers"
        description="Choose a server where Wutherer is available to manage its installed controls."
        action={
          <Button variant="outline" size="sm" onClick={loadGuilds} disabled={loading} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      <div className="mt-6">
        {!loading && guilds.length > 0 && (
          <label className="relative mb-4 block max-w-sm">
            <span className="sr-only">Search your servers</span>
            <Terminal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter servers…"
              className="w-full rounded-md border border-card-border bg-surface py-1.5 pl-9 pr-3 text-sm text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
        )}

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border border-card-border bg-surface" />
            ))}
          </div>
        )}

        {!loading && error && (
          <Card>
            <EmptyState
              icon={Server}
              title="Could not load servers"
              description="The bot API is unreachable. Make sure the bot is running, then try again."
              action={<Button size="sm" onClick={loadGuilds}>Try again</Button>}
            />
          </Card>
        )}

        {!loading && !error && visibleGuilds.length === 0 && (
          <Card>
            <EmptyState icon={Server} title="No servers found" description="Wutherer isn't in any servers yet, or none match your search." />
          </Card>
        )}

        {!loading && !error && visibleGuilds.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGuilds.map((guild) => (
              <Link key={guild.id} href={`/dashboard/guild/${guild.id}`}>
                <Card className="group flex items-center gap-3 transition-colors hover:border-primary/40">
                  {guild.icon ? (
                    <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`} alt={guild.name} className="h-10 w-10 rounded-full" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-hover text-sm font-bold text-foreground">
                      {guild.name[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{guild.name}</p>
                    <p className="text-xs text-slate-400">{guild.member_count ?? "—"} members</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-light" aria-hidden="true" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
