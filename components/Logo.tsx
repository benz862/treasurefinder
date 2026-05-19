import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-11 w-auto max-w-[180px] sm:max-w-[220px]",
  md: "h-16 w-auto max-w-[260px] sm:max-w-[320px]",
  lg: "h-36 w-auto max-w-[min(100%,520px)] sm:h-44",
} as const;

interface LogoProps {
  size?: keyof typeof sizeClasses;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = "sm",
  href = "/",
  className,
  priority,
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt="Treasure Finder — Find it. Love it. Take it home."
      width={2041}
      height={1275}
      priority={priority ?? size === "lg"}
      className={cn(sizeClasses[size], className)}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
