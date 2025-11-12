// src/components/organisms/Contact.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H2, Lead } from "../atoms/Heading";
import Button from "../atoms/Button";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useReveal } from "../../hooks/useReveal";
import { MailIcon, PinIcon, ClockIcon } from "../atoms/Icons";
import { z } from "zod";


declare global {
  interface Window {
    turnstile?: any;
  }
}

/* ============================
   UI helpers
   ============================ */
function InfoRow({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-app bg-transparent p-4">
      <div
        className="inline-grid h-15 w-15 flex-none shrink-0 place-items-center rounded-2xl text-[--white] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-soft"
        aria-hidden
      >
        <div className="h-6 w-6 text-[var(--white)]">{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-md font-semibold text-[--text]">{title}</p>
        <p className="text-sm text-[--muted] whitespace-pre-line">{subtitle}</p>
      </div>
    </div>
  );
}

/* ============================
   Validation Schema (Zod + i18n)
   ============================ */
function makeContactSchema(t: any) {
  return z.object({
    name: z
      .string()
      .min(2, t("form.error.name_full", "Please enter your full name."))
      .max(30, t("form.error.name_max", "Max 30 characters.")),
    email: z
      .string()
      .email(t("form.error.email_invalid", "Please enter a valid email."))
      .max(160),
    subject: z
      .string()
      .min(2, t("form.error.subject_short", "Subject is too short."))
      .max(160, t("form.error.subject_max", "Max 160 characters.")),
    message: z
      .string()
      .min(10, t("form.error.message_short", "Message should be at least 10 characters."))
      .max(300, t("form.error.message_max", "Max 300 characters.")),
  });
}
type ContactInput = z.infer<ReturnType<typeof makeContactSchema>>;

function mapIssues(issues: z.ZodIssue[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = i.path.join(".");
    if (key) out[key] = i.message;
  }
  return out;
}

/* Turnstile token (invisible) */
async function getTurnstileToken(sitekey?: string): Promise<string> {
  if (!sitekey) return ""; // dev mode without captcha
  await new Promise<void>((resolve) => {
    const check = () => (window.turnstile ? resolve() : setTimeout(check, 40));
    check();
  });
  return await new Promise<string>((resolve, reject) => {
    try {
      window.turnstile.render("#cf-turnstile", {
        sitekey,
        appearance: "execute",
        callback: (token: string) => resolve(token),
        "error-callback": () => reject(new Error("Captcha failed")),
        retry: "auto",
      });
      window.turnstile.execute("#cf-turnstile");
    } catch (e) {
      reject(e);
    }
  });
}

export default function Contact() {
  const { t, i18n } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  useReveal();

  const ContactSchema = makeContactSchema(t);

  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [ts] = useState(() => Date.now());

  useEffect(() => {
    if (!Object.keys(errs).length) return;
    if (!formRef.current) return;
    const Schema = makeContactSchema(t);
    const fd = new FormData(formRef.current);
    const current = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
    };
    const parsed = Schema.safeParse(current);
    if (!parsed.success) {
      setErrs(
        parsed.error.issues.reduce((acc, i) => {
          const key = i.path.join(".");
          if (key) acc[key] = i.message;
          return acc;
        }, {} as Record<string, string>)
      );
    } else {
      setErrs({});
    }
  }, [i18n.language, t]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    setError("");
    setOk("");
    setErrs({});

    if (Date.now() - ts < 2500) {
      setError(t("form.error.too_fast", "Please take a moment to complete the form."));
      return;
    }

    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      company: String(fd.get("company") || ""),
      ts,
    };

    const parsed = ContactSchema.safeParse(data as ContactInput);
    if (!parsed.success) {
      setErrs(mapIssues(parsed.error.issues));
      setError(t("form.error.fix_fields", "Please fix the highlighted fields."));
      return;
    }

    if (data.company) {
      setOk(t("form.success", "Thanks! We’ll get back to you shortly."));
      form.reset();
      return;
    }

    try {
      setSending(true);

      const sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY as string | undefined;
      const captchaToken = await getTurnstileToken(sitekey);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captcha: captchaToken }),
      });

      if (!res.ok) {
        let payload: any = {};
        try {
          payload = await res.json();
        } catch { }
        if (payload?.issues) {
          setErrs(Object.fromEntries(payload.issues.map((i: any) => [i.path, i.message])));
        }
        throw new Error(payload?.error || `HTTP ${res.status}`);
      }

      setOk(t("form.success", "Thanks! We’ll get back to you shortly."));
      setError("");
      form.reset();
    } catch (err: any) {
      console.error("Contact submit failed:", err);
      setOk("");
      setError(err?.message || t("form.error.network", "Network error. Please try again."));
    } finally {
      setSending(false);
    }
  };

  const errId = (field: "name" | "email" | "subject" | "message") =>
    `field-${field}-error`;

  return (
    <section
      id="contact"
      className="py-24 md:py-28 bg-shell text-body scroll-mt-20 bg-grad-1"
      aria-labelledby="contact-title"
      aria-describedby="contact-desc"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2 id="contact-title">{t("contact.title")}</H2>
          <Lead id="contact-desc" className="mt-3">
            {t("contact.blurb")}
          </Lead>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 ">
          <div className="space-y-4 reveal text-left" aria-label={t("contact.title")}>
            <InfoRow
              icon={<MailIcon />}
              title={t("contact.email.label")}
              subtitle={t("contact.email.value")}
            />
            <InfoRow
              icon={<PinIcon />}
              title={t("contact.location.label")}
              subtitle={t("contact.location.value")}
            />
            <InfoRow
              icon={<ClockIcon />}
              title={t("contact.hours.label")}
              subtitle={t("contact.hours.value")}
            />
          </div>

          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="space-y-4 reveal"
            noValidate
            aria-describedby={error ? "form-error" : ok ? "form-success" : undefined}
          >
            <label htmlFor="company" className="sr-only">
              Company
            </label>
            <input
              id="company"
              name="company"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
            />

            <input type="hidden" name="ts" value={ts} />
            <div id="cf-turnstile" className="hidden" aria-hidden="true" />

            {(["name", "email", "subject", "message"] as const).map((field) => {
              const isTextArea = field === "message";
              const label = t(`form.${field}`);
              const ph =
                t(`form.placeholder.${field}`, {
                  defaultValue:
                    field === "name"
                      ? "Your name"
                      : field === "email"
                        ? "Your email"
                        : field === "subject"
                          ? "Subject"
                          : "Your message",
                }) || undefined;

              const common =
                "w-full rounded-app border border-[var(--primary)] text-[--text] placeholder-[--muted] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]";

              const auto =
                field === "name"
                  ? "name"
                  : field === "email"
                    ? "email"
                    : "off";

              const invalid = Boolean(errs[field]);

              return (
                <div key={field}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={field}>
                    {label}
                  </label>

                  {isTextArea ? (
                    <textarea
                      id={field}
                      name={field}
                      rows={6}
                      placeholder={ph}
                      className={`${common} px-4 py-3 glow-pulse`}
                      autoComplete="off"
                      required
                      aria-required="true"
                      aria-invalid={invalid}
                      aria-describedby={invalid ? errId(field) : undefined}
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      autoComplete={auto as any}
                      placeholder={ph}
                      className={`${common} h-12 px-4 glow-pulse`}
                      required
                      aria-required="true"
                      aria-invalid={invalid}
                      aria-describedby={invalid ? errId(field) : undefined}
                    />
                  )}

                  {errs[field] && (
                    <p
                      id={errId(field)}
                      className="mt-1 text-sm text-[var(--danger)]"
                      role="alert"
                    >
                      {errs[field]}
                    </p>
                  )}
                </div>
              );
            })}

            <Button
              variant="outline"
              movingBorder
              type="submit"
              className="mt-2 h-13 w-50 shadow-lg hover:shadow-xl hover:shadow-blue-600/20 rainbow-border-round"
              disabled={sending}
              aria-label={sending ? t("form.sending") : t("form.send")}
            >
              {sending ? t("form.sending", "Sending…") : t("form.send")}
            </Button>

            {error && (
              <p id="form-error" role="alert" className="text-sm text-[--danger]">
                {error}
              </p>
            )}
            {ok && (
              <p id="form-success" aria-live="polite" className="text-sm text-emerald-500">
                {ok}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}

export { Contact };
