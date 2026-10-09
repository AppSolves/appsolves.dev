import { useEffect } from "react";

export default function PageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  useEffect(() => {
    const previousTitle = document.title;
    const updates: [Element, string, string | null][] = [];
    const set = (selector: string, attribute: string, value: string) => {
      const element = document.querySelector(selector);
      if (!element) return;
      updates.push([element, attribute, element.getAttribute(attribute)]);
      element.setAttribute(attribute, value);
    };
    document.title = `${title} | AppSolves`;
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("main")?.focus({ preventScroll: true });
    set('link[rel="canonical"]', "href", `https://appsolves.dev${path}`);
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      set(selector, "content", description);
    }
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) {
      set(selector, "content", `${title} | AppSolves`);
    }
    set('meta[property="og:url"]', "content", `https://appsolves.dev${path}`);
    return () => {
      document.title = previousTitle;
      for (const [element, attribute, value] of updates) {
        if (value === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, value);
      }
    };
  }, [title, description, path]);
  return null;
}
