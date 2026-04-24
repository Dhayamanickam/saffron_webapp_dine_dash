import { Utensils } from "lucide-react";

export function DishVisual({ hue, name, className = "" }: { hue: number; name: string; className?: string }) {
  const bg = `linear-gradient(135deg, hsl(${hue} 80% 58%) 0%, hsl(${(hue + 18) % 360} 75% 45%) 100%)`;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("");
  return (
    <div
      className={`relative overflow-hidden rounded-xl flex items-center justify-center text-white ${className}`}
      style={{ background: bg }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-20" style={{
        background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.6), transparent 50%)"
      }} />
      <div className="relative flex flex-col items-center gap-1">
        <Utensils className="size-5 opacity-90" />
        <span className="text-xs font-semibold tracking-wider">{initials.toUpperCase()}</span>
      </div>
    </div>
  );
}
