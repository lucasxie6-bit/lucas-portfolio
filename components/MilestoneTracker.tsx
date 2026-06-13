// Mock UI of the milestone tracker — replace with a real screenshot via next/image
// once you have one captured.

type Status = "done" | "in-progress" | "upcoming";

interface Milestone {
  id: number;
  title: string;
  description: string;
  status: Status;
  date: string;
}

const milestones: Milestone[] = [
  {
    id: 1,
    title: "Define core service offering",
    description: "Scoped the first three service packages and pricing tiers.",
    status: "done",
    date: "Mar 2025",
  },
  {
    id: 2,
    title: "First paying client",
    description: "Landed first client via outreach — manual invoicing, no platform yet.",
    status: "done",
    date: "Apr 2025",
  },
  {
    id: 3,
    title: "Build client onboarding flow",
    description: "Intake form + automated email sequence via simple tooling.",
    status: "in-progress",
    date: "Jun 2025",
  },
  {
    id: 4,
    title: "Launch public-facing site",
    description: "SEO-optimized landing page with live case studies.",
    status: "upcoming",
    date: "Aug 2025",
  },
  {
    id: 5,
    title: "Hire first contractor",
    description: "Delegate delivery work to scale capacity.",
    status: "upcoming",
    date: "Q4 2025",
  },
];

const statusConfig: Record<Status, { dot: string; badge: string; label: string }> = {
  done: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Done",
  },
  "in-progress": {
    dot: "bg-[#6B9FCC]",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    label: "In progress",
  },
  upcoming: {
    dot: "bg-stone-300",
    badge: "bg-stone-50 text-stone-500 border-stone-200",
    label: "Upcoming",
  },
};

export default function MilestoneTracker() {
  const done = milestones.filter((m) => m.status === "done").length;
  const progress = Math.round((done / milestones.length) * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden font-[family-name:var(--font-inter)]">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="text-xs text-white/40 tracking-wide font-medium">
          useno — milestones
        </span>
        <div className="w-16" />
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
            Progress
          </span>
          <span className="text-xs font-semibold text-white/70">
            {done}/{milestones.length} milestones
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#6B9FCC] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Milestone list */}
      <div className="divide-y divide-white/5">
        {milestones.map((m, i) => {
          const cfg = statusConfig[m.status];
          return (
            <div
              key={m.id}
              className={`px-5 py-4 flex items-start gap-4 ${
                m.status === "in-progress" ? "bg-white/5" : ""
              }`}
            >
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center pt-1 shrink-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${
                    m.status === "in-progress" ? "ring-2 ring-[#6B9FCC]/30" : ""
                  }`}
                />
                {i < milestones.length - 1 && (
                  <div className="w-px flex-1 mt-1 bg-white/10 min-h-[20px]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`text-sm font-medium ${
                      m.status === "upcoming" ? "text-white/40" : "text-white/85"
                    }`}
                  >
                    {m.title}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cfg.badge}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <span className="text-xs text-white/30 shrink-0 pt-0.5">{m.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
