interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function Spinner({ size = "md", color = "currentColor" }: SpinnerProps) {
  const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-6 w-6" };
  return (
    <svg className={`animate-spin ${sizes[size]}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="4" />
      <path className="opacity-75" fill={color} d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
