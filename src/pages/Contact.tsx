import { useCallback, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import PageMetadata from "@/components/PageMetadata";
import Turnstile from "@/components/Turnstile";

const apiUrl = import.meta.env.VITE_CONTACT_API_URL || "";
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const configured = Boolean(apiUrl && siteKey);
type Fields = "name" | "email" | "subject" | "message";
const fields: {
  name: Fields;
  label: string;
  max: number;
  required?: boolean;
  autocomplete?: string;
}[] = [
  { name: "name", label: "Name", max: 100, autocomplete: "name" },
  {
    name: "email",
    label: "Email",
    max: 254,
    required: true,
    autocomplete: "email",
  },
  { name: "subject", label: "Subject", max: 160 },
  { name: "message", label: "Message", max: 5_000, required: true },
];
const failures: Record<string, string> = {
  VERIFICATION_FAILED:
    "Verification expired or failed. Please verify again and retry.",
  RATE_LIMITED:
    "The sending limit has been reached. Please try later or email contact@appsolves.dev.",
  INVALID_INPUT: "Please check your email and message, then try again.",
  REQUEST_TOO_LARGE:
    "Your message is too large. Please shorten it and try again.",
  SEND_UNCONFIRMED:
    "We could not confirm whether your message was accepted. Please email contact@appsolves.dev before resending to avoid duplicates.",
  SEND_FAILED:
    "Your message could not be sent. Please try again or email contact@appsolves.dev.",
};

export default function Contact() {
  const [token, setToken] = useState("");
  const onToken = useCallback((value: string) => setToken(value), []);
  const [renewal, setRenewal] = useState(0);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = Object.fromEntries(
      fields.map(({ name }) => [name, String(values.get(name) ?? "").trim()]),
    );
    const invalid: Partial<Record<Fields, string>> = {};
    for (const field of fields) {
      const input = form.elements.namedItem(field.name) as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (field.required && !payload[field.name])
        invalid[field.name] = `Please enter your ${field.name}.`;
      else if (
        !input.validity.valid ||
        payload[field.name].length > field.max ||
        (field.name !== "message" && /[\r\n]/.test(payload[field.name]))
      ) {
        invalid[field.name] =
          field.name === "email"
            ? "Please enter a valid email address."
            : `Please check your ${field.name}.`;
      }
    }
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      (form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement).focus();
      setNotice("Please correct the highlighted fields.");
      return;
    }
    if (!configured) {
      setNotice(
        "The form is currently unavailable. Please email contact@appsolves.dev.",
      );
      return;
    }
    if (!token) {
      setNotice("Please complete the verification before sending.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token }),
        signal: AbortSignal.timeout(25_000),
        credentials: "omit",
      });
      const result = (await response.json()) as { code?: string };
      if (!response.ok || result.code !== "ACCEPTED") {
        setNotice(
          failures[result.code ?? ""] ??
            "The form is temporarily unavailable. Please try again or email contact@appsolves.dev.",
        );
        return;
      }
      setAccepted(true);
      setNotice(
        "Your message has been accepted for sending. Thank you for getting in touch.",
      );
      form.reset();
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setNotice(
        "We could not confirm whether your message was accepted. Your text is still here. Please email contact@appsolves.dev before resending to avoid duplicates.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
      setToken("");
      setRenewal((value) => value + 1);
    }
  }

  return (
    <div className="contact-route">
      <PageMetadata
        title="Contact"
        description="Send Kaan Gönüldinc a message about a project, an idea, or a question."
        path="/contact"
      />
      <Navigation />
      <main id="main" tabIndex={-1} className="contact-page page-width">
        <header className="contact-page-heading">
          <p className="section-label">Contact</p>
          <h1>
            Let’s <em>talk.</em>
          </h1>
          <p>Have a project, an idea, or a question? Send me a message.</p>
          <a className="text-link" href="mailto:contact@appsolves.dev">
            contact@appsolves.dev
          </a>
        </header>
        <div className="contact-form-area">
          {!accepted && (
            <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy}>
              <div className="contact-fields">
                {fields.map(({ name, label, max, required, autocomplete }) => (
                  <div className={`contact-field field-${name}`} key={name}>
                    <label htmlFor={`contact-${name}`}>
                      {label}
                      {!required && <span> (optional)</span>}
                    </label>
                    {name === "message" ? (
                      <textarea
                        id={`contact-${name}`}
                        name={name}
                        rows={7}
                        maxLength={max}
                        required
                        aria-invalid={Boolean(errors[name])}
                        aria-describedby={
                          errors[name] ? `${name}-error` : undefined
                        }
                        disabled={busy}
                      />
                    ) : (
                      <input
                        id={`contact-${name}`}
                        name={name}
                        type={name === "email" ? "email" : "text"}
                        autoComplete={autocomplete}
                        maxLength={max}
                        required={required}
                        disabled={busy}
                        aria-invalid={Boolean(errors[name])}
                        aria-describedby={
                          errors[name] ? `${name}-error` : undefined
                        }
                      />
                    )}
                    {errors[name] && (
                      <p id={`${name}-error`} className="field-error">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {configured ? (
                <Turnstile
                  siteKey={siteKey}
                  renewal={renewal}
                  onToken={onToken}
                />
              ) : (
                <p className="form-availability">
                  The form is currently unavailable. You can{" "}
                  <a href="mailto:contact@appsolves.dev">send an email</a>.
                </p>
              )}
              <p className="form-privacy">
                Your information is used to respond to your inquiry. See the{" "}
                <Link to="/privacy_policy">Privacy Policy</Link>.
              </p>
              <button
                className="contact-submit"
                type="submit"
                disabled={busy || !configured}
              >
                {busy ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
          <div
            ref={statusRef}
            className={`form-status${accepted ? " form-success" : ""}`}
            role="status"
            aria-live="polite"
            tabIndex={-1}
          >
            {notice}
            {accepted && (
              <button
                className="text-link"
                onClick={() => {
                  setAccepted(false);
                  setNotice("");
                }}
              >
                Send another message
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
