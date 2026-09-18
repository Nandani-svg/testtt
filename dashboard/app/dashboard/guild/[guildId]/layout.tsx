import { Sidebar } from "@/components/dashboard/sidebar";

export default function GuildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { guildId: string };
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar guildId={params.guildId} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
