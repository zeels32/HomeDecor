export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
      <div className="h-8 bg-sand-200/60 rounded-xs w-48" />
      <div className="h-4 bg-sand-200/40 rounded-xs w-96 max-w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-4/5 bg-sand-200/50 rounded-xs" />
            <div className="h-3.5 bg-sand-200/60 rounded-xs w-3/4" />
            <div className="h-3.5 bg-sand-200/40 rounded-xs w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
