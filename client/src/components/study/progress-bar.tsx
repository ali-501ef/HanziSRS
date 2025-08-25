interface ProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Study Progress</span>
        <span className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-progress-count">
          {current} / {total} cards
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          data-testid="progress-bar-fill"
        ></div>
      </div>
    </div>
  );
}
