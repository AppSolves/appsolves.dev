import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}
let scriptPromise: Promise<TurnstileApi> | undefined;
const SCRIPT_TIMEOUT_MS = 15_000;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      const failed = () => {
        clearTimeout(deadline);
        script.remove();
        reject(new Error("Verification unavailable"));
      };
      const deadline = setTimeout(failed, SCRIPT_TIMEOUT_MS);
      script.onload = () => {
        clearTimeout(deadline);
        if (window.turnstile) resolve(window.turnstile);
        else reject(new Error("Verification unavailable"));
      };
      script.onerror = failed;
      document.head.append(script);
    }).catch((error) => {
      scriptPromise = undefined;
      throw error;
    });
  }
  return scriptPromise;
}

export default function Turnstile({
  siteKey,
  renewal,
  onToken,
}: {
  siteKey: string;
  renewal: number;
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    let id: string | undefined;
    let api: TurnstileApi | undefined;
    let compact: boolean | undefined;
    onToken("");
    const failure = (message: string) => {
      if (active) {
        onToken("");
        setError(message);
      }
    };
    const render = () => {
      if (!active || !container.current || !api) return;
      // Turnstile's flexible widget needs 300px; compact is its native narrow layout.
      const narrow = container.current.clientWidth < 300;
      if (id && compact === narrow) return;
      if (id) api.remove(id);
      compact = narrow;
      onToken("");
      id = api.render(container.current, {
        sitekey: siteKey,
        action: "contact",
        theme: resolvedTheme === "dark" ? "dark" : "light",
        size: compact ? "compact" : "flexible",
        retry: "never",
        "refresh-expired": "auto",
        callback: (token: string) => {
          if (active) {
            setError("");
            onToken(token);
          }
        },
        "expired-callback": () =>
          failure("Verification expired. Please verify again."),
        "timeout-callback": () =>
          failure("Verification timed out. Please try again."),
        "error-callback": () => {
          failure(
            "Verification is unavailable. Please retry or send an email.",
          );
          return true;
        },
      });
    };
    const observer = new ResizeObserver(render);
    if (container.current) observer.observe(container.current);
    loadTurnstile()
      .then((loaded) => {
        if (!active) return;
        setError("");
        api = loaded;
        render();
      })
      .catch(() =>
        failure("Verification could not load. Please retry or send an email."),
      );
    return () => {
      active = false;
      observer.disconnect();
      if (id && api) api.remove(id);
    };
  }, [siteKey, renewal, retry, resolvedTheme, onToken]);
  return (
    <div className="contact-verification">
      <div ref={container} />
      {error && (
        <p role="status">
          {error}{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => setRetry((value) => value + 1)}
          >
            Retry verification
          </button>
        </p>
      )}
    </div>
  );
}
