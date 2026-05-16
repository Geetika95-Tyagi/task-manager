import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, CirclePlus, Clock3, LayoutDashboard, LayoutGrid, LucideIcon, Sparkles, SquarePen, Users } from 'lucide-react';
import type { Dashboard, Project, Role, TaskStatus } from '../lib/types';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui';

type StatusMeta = Record<TaskStatus, { label: string; tone: 'default' | 'subtle' | 'success' | 'danger' }>;

type DashboardViewProps = {
  dashboard: Dashboard | null;
  userRole: Role;
  selectedProject: Project | null;
  canManageSelectedProject: boolean;
  saving: boolean;
  statusMeta: StatusMeta;
  onNewProject: () => void;
  onSeedDemo: () => void;
  onOpenBoard: () => void;
  onOpenTasks: () => void;
  onOpenTeam: () => void;
};

export function DashboardView({
  dashboard,
  userRole,
  selectedProject,
  canManageSelectedProject,
  saving,
  statusMeta,
  onNewProject,
  onSeedDemo,
  onOpenBoard,
  onOpenTasks,
  onOpenTeam
}: DashboardViewProps) {
  const totalTasks = dashboard?.tasks ?? 0;
  const openTasks = totalTasks - (dashboard?.statusCounts?.Done ?? 0);
  const statusRows: { key: TaskStatus; label: string; count: number; barClass: string }[] = [
    { key: 'Todo', label: 'To do', count: dashboard?.statusCounts?.Todo ?? 0, barClass: 'bg-muted/50' },
    { key: 'InProgress', label: 'In progress', count: dashboard?.statusCounts?.InProgress ?? 0, barClass: 'bg-cyan/70' },
    { key: 'Done', label: 'Completed', count: dashboard?.statusCounts?.Done ?? 0, barClass: 'bg-success' }
  ];

  const metrics: { label: string; value: number | string; icon: LucideIcon }[] = [
    { label: 'Projects', value: dashboard?.projects ?? 0, icon: LayoutDashboard },
    { label: 'Open tasks', value: openTasks, icon: SquarePen },
    { label: 'Due soon', value: dashboard?.dueSoon ?? 0, icon: Clock3 },
    { label: 'Total tasks', value: totalTasks, icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-line bg-gradient-to-r from-accent/10 via-panel to-panel shadow-card">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="flex flex-1 flex-col justify-center lg:max-w-md">
            <p className="text-2xs font-semibold uppercase tracking-widest text-accent">Dashboard</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-text">Workspace overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Track delivery health across {dashboard?.projects ?? 0} project{(dashboard?.projects ?? 0) === 1 ? '' : 's'} and{' '}
              {totalTasks} total task{totalTasks === 1 ? '' : 's'}.
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-xs text-muted">Overdue</p>
                <p className="font-semibold tabular-nums text-danger">{dashboard?.overdue ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Due soon</p>
                <p className="font-semibold tabular-nums text-text">{dashboard?.dueSoon ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Open work</p>
                <p className="font-semibold tabular-nums text-text">{openTasks}</p>
              </div>
            </div>
          </div>
          <div className="flex min-w-[10rem] flex-col items-center justify-center rounded-lg border border-line/80 bg-panel/90 px-8 py-6 lg:w-48">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Completion</p>
            <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-gradient">{dashboard?.completionRate ?? 0}%</p>
            <p className="mt-2 text-center text-xs text-muted">of all tasks marked done</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3.5 transition hover:border-accent/25 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
                  <p className="text-2xl font-semibold tabular-nums leading-none">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Task pipeline</CardTitle>
              <CardDescription>Distribution by status across all projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalTasks === 0 ? (
                <p className="text-sm text-muted">No tasks yet. Create a project and add work to see the pipeline.</p>
              ) : (
                statusRows.map((row) => {
                  const pct = Math.round((row.count / totalTasks) * 100);
                  return (
                    <div key={row.key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-text">{row.label}</span>
                        <span className="tabular-nums text-muted">
                          {row.count} <span className="text-2xs">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-panel2">
                        <div className={`h-full rounded-full transition-all ${row.barClass}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-4 lg:self-start">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick actions</CardTitle>
            <CardDescription>Shortcuts to common workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {userRole === 'Admin' ? (
              <Button variant="subtle" className="h-10 w-full justify-start gap-3" onClick={onNewProject}>
                <CirclePlus className="h-4 w-4 shrink-0" />
                New project
              </Button>
            ) : null}
            <Button variant="subtle" className="h-10 w-full justify-start gap-3" onClick={onSeedDemo} disabled={saving}>
              <Sparkles className="h-4 w-4 shrink-0" />
              Seed demo data
            </Button>
            {selectedProject ? (
              <>
                <div className="my-1 border-t border-line" />
                <p className="px-1 text-2xs font-medium uppercase tracking-wide text-muted">Current project</p>
                <Button variant="subtle" className="h-10 w-full justify-start gap-3" onClick={onOpenBoard}>
                  <LayoutGrid className="h-4 w-4 shrink-0" />
                  Board
                </Button>
                <Button variant="subtle" className="h-10 w-full justify-start gap-3" onClick={onOpenTasks}>
                  <SquarePen className="h-4 w-4 shrink-0" />
                  All tasks
                </Button>
                {canManageSelectedProject ? (
                  <Button variant="subtle" className="h-10 w-full justify-start gap-3" onClick={onOpenTeam}>
                    <Users className="h-4 w-4 shrink-0" />
                    Team
                  </Button>
                ) : null}
              </>
            ) : (
              <p className="rounded-md border border-dashed border-line bg-panel2/50 px-3 py-4 text-center text-xs leading-relaxed text-muted">
                Select a project from the sidebar to unlock board, tasks, and team shortcuts.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-col gap-3 border-b border-line sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Latest task updates across your workspace.</CardDescription>
          </div>
          {(dashboard?.recentTasks ?? []).length ? (
            <span className="text-2xs font-medium uppercase tracking-wide text-muted">
              Showing {Math.min(8, dashboard?.recentTasks?.length ?? 0)} updates
            </span>
          ) : null}
        </CardHeader>
        <CardContent className="p-0">
          {(dashboard?.recentTasks ?? []).length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-panel2/60 text-2xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-semibold">Task</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">Assignee</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {(dashboard?.recentTasks ?? []).slice(0, 8).map((task) => (
                    <tr key={task.id} className="transition-colors hover:bg-panel2/40">
                      <td className="max-w-[14rem] px-5 py-3.5 font-medium text-text sm:max-w-none">{task.title}</td>
                      <td className="hidden px-4 py-3.5 text-muted sm:table-cell">{task.assignee?.name || 'Unassigned'}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={task.status === 'Done' ? 'success' : 'subtle'}>{statusMeta[task.status].label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs text-muted">
                        {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-muted">No recent task updates.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
