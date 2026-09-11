import Image from "next/image";

// Intrinsic aspect ratio of /public/logo.png (the client's wordmark, keyed
// out of its white background — see public/logo-icon.png for the mark-only
// crop used for favicons).
const LOGO_ASPECT = 1201 / 380;

export default function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-soft transition-shadow duration-300 ${
        light ? "shadow-[0_2px_16px_rgba(0,0,0,0.25)]" : ""
      } ${className}`}
    >
      <Image
        src="/logo.png"
        alt="La Conciergerie Del Sol"
        width={Math.round(28 * LOGO_ASPECT)}
        height={28}
        priority
        className="h-6 w-auto sm:h-7"
      />
    </span>
  );
}
