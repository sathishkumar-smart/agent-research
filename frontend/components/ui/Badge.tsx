interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
}

const variants = {
  default: "bg-gray-700 text-gray-300",
  success: "bg-green-900/40 text-green-400 border border-green-800",
  warning: "bg-yellow-900/40 text-yellow-400 border border-yellow-800",
  error: "bg-red-900/40 text-red-400 border border-red-800",
  info: "bg-blue-900/40 text-blue-400 border border-blue-800",
  purple: "bg-purple-900/40 text-purple-400 border border-purple-800",
};

export function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${variants[variant]}`}>
      {label}
    </span>
  );
}
