interface ErrorStateProps {
  title: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="rounded-full bg-bear-soft p-2.5 text-bear">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {message && <p className="max-w-sm text-xs text-slate-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-accent hover:text-accent"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
