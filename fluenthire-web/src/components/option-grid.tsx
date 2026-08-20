"use client";

export function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { value: T; label: string; description?: string }[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div className={`grid gap-2 ${columns === 4 ? "grid-cols-3 sm:grid-cols-4" : columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg border px-3 py-3 text-center text-sm transition-colors ${
            value === option.value
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-border hover:border-primary/30 hover:bg-muted/50"
          }`}
        >
          <span className="font-medium">{option.label}</span>
          {option.description && (
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
