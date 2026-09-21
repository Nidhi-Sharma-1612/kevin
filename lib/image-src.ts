// Hosts next/image is configured to optimise (see next.config.ts). Anything
// else — e.g. a link an editor pasted from another site — is passed through
// untouched with `unoptimized`, since next/image throws on unconfigured
// remote hosts. Kept out of cms.ts (which is server-only) so client
// components can use it too.
const OPTIMIZED_HOSTS = ["l.icdbcdn.com", "admin.weblaucher.com"];

export function isUnoptimized(src: string): boolean {
  if (src.startsWith("/")) return false;
  try {
    return !OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return true;
  }
}
