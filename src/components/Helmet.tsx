import { CONFIG } from "@/config";

/** React 19 hoists <title> into <head>. */
export function Helmet({ title }: { title?: string }) {
  return <title>{title ? `${title} | ${CONFIG.APP_NAME}` : CONFIG.APP_NAME}</title>;
}

export default Helmet;
