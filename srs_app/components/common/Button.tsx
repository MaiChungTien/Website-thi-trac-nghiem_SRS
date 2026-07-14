type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = "primary", ...props }: ButtonProps) {
  const base = "rounded-lg px-4 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-cyan-600 text-white hover:bg-cyan-700"
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
}
