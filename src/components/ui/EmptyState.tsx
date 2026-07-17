interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, subtitle, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      {icon}
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {subtitle && <p className="max-w-xs text-xs text-slate-500">{subtitle}</p>}
      {action}
    </div>
  );
}
