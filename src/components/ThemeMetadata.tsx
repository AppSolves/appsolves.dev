import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeMetadata() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (meta) meta.content = resolvedTheme === "dark" ? "#11120f" : "#f5f3ed";
  }, [resolvedTheme]);
  return null;
}
