import Link from "next/link";
import { ArrowRight, Server } from "lucide-react";

const MOCK_GUILDS = [
  { id: "111", name: "My Server", icon: null, memberCount: 120 },
  { id: "222", name: "Dev Hub", icon: null, memberCount: 45 },
];

export default function GuildsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-1">All Servers</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Pick a server to configure.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_GUILDS.map((guild) => (
          <Link
            key={guild.id}
            href={`/dashboard/guild/${guild.id}`}
            className="group flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--raised)]">
              <Server className="h-5 w-5 text-[var(--primary-light)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">{guild.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{guild.memberCount} members</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
