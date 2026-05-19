import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  full: {
    src: "/logo.png",
    width: 2041,
    height: 1275,
    sm: "h-10 w-auto",
    md: "h-14 w-auto",
    lg: "h-32 w-auto sm:h-40",
  },
  compact: {
    src: "/logo-header.png",
    width: 2250,
    height: 1500,
    sm: "h-11 w-auto max-w-[220px]",
    md: "h-16 w-auto max-w-[280px]",
    lg: "h-28 w-auto max-w-[420px] sm:h-36",
  },
} as const;

const sizeClasses = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

interface LogoProps {
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variants;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = "sm",
  variant = "compact",
  href = "/",
  className,
  priority,
}: LogoProps) {
  const config = variants[variant];
  const sizeKey = sizeClasses[size];

  const image = (
    <Image
      src={config.src}
      alt="Treasure Finder — Find it. Love it. Take it home."
      width={config.width}
      height={config.height}
      priority={priority ?? size === "lg"}
      className={cn(config[sizeKey], className)}
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
