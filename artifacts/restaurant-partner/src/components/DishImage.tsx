import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { dishImageMap, fallbackDish } from "@/lib/dishImages";

type Props = {
  itemId?: string;
  src?: string;
  name: string;
  className?: string;
  rounded?: string;
};

export function DishImage({
  itemId,
  src,
  name,
  className = "",
  rounded = "rounded-xl",
}: Props) {
  const activeImageSource =
    src ?? (itemId ? dishImageMap[itemId] : undefined) ?? fallbackDish;

  const [displaySrc, setDisplaySrc] = useState(activeImageSource);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setDisplaySrc(activeImageSource);
    setErrored(false);
  }, [src, itemId]);

  return (
    <div
      className={`relative overflow-hidden bg-secondary ${rounded} ${className}`}
      aria-label={name}
    >
      <img
        src={displaySrc}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={() => {
          if (!errored) {
            setErrored(true);
            setDisplaySrc(fallbackDish);
          }
        }}
      />
      {errored && (
        <div className="absolute bottom-1 right-1 inline-flex items-center gap-1 rounded-full bg-background/80 px-1.5 py-0.5 text-[9px] text-muted-foreground">
          <ImageIcon className="size-2.5" /> fallback
        </div>
      )}
    </div>
  );
}
