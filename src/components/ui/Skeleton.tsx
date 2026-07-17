export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface-overlay ${className}`} />;
}

export function TableSkeletonRows({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-surface-border/60">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-3.5 w-12" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="ms-auto h-3.5 w-20" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="ms-auto h-3.5 w-14" />
          </td>
          <td className="hidden px-4 py-3 sm:table-cell">
            <Skeleton className="ms-auto h-3.5 w-16" />
          </td>
        </tr>
      ))}
    </>
  );
}
