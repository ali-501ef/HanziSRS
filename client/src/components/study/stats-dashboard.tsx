import { type UserStats } from "@shared/schema";

interface StatsDashboardProps {
  stats: UserStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const statsData = [
    {
      value: stats.streak,
      label: "Day Streak",
      color: "text-primary",
      testId: "stat-streak",
    },
    {
      value: stats.learnedCharacters,
      label: "Characters Learned",
      color: "text-accent",
      testId: "stat-learned",
    },
    {
      value: `${stats.accuracy}%`,
      label: "Accuracy",
      color: "text-purple-600",
      testId: "stat-accuracy",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat) => (
        <div key={stat.label} className="surface p-6 rounded-xl shadow-soft text-center">
          <div className={`text-3xl font-bold mb-2 ${stat.color}`} data-testid={stat.testId}>
            {stat.value}
          </div>
          <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
