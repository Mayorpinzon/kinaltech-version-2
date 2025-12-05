// src/components/organisms/Contact.tsx
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Container, H2, Lead, Button, MailIcon, PinIcon, ClockIcon } from "../atoms";
import { useEffect, useRef, useState, useCallback, type FormEvent, type ReactNode } from "react";
import { useReveal } from "../../hooks/useReveal";
import { z } from "zod";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { contactMessagesRef } from "../../lib/firebase";
import { ENV } from "../../lib/env";
import type { ContactMessageInput } from "../../types/contact";

type TurnstileRenderOptions = {
  sitekey: string;
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  retry?: "auto" | "never";
};

type TurnstileInstance = {
  render: (container: string, options: TurnstileRenderOptions) => unknown;
  execute: (container: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
  var turnstile: TurnstileInstance | undefined;
}

/* ============================
   UI helpers
   ============================ */
function InfoRow({
  icon,
  title,
  subtitle,
}: Readonly<{
  icon: ReactNode;
  title: string;
  subtitle: string;
}>) {
  return (
    <div className="flex items-start gap-5 rounded-app bg-transparent p-4">
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
function makeContactSchema(t: TFunction) {
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

function mapIssues(issues: z.ZodError["issues"]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = i.path.join(".");
    if (key) out[key] = i.message;
  }
  return out;
}

/* Turnstile token helper (kept for future backend use) */
async function getTurnstileToken(sitekey?: string): Promise<string> {
  if (!sitekey) return ""; // dev mode without captcha

  await new Promise<void>((resolve) => {
    const check = () => (globalThis.turnstile ? resolve() : setTimeout(check, 40));
    check();
  });

  return await new Promise<string>((resolve, reject) => {
    try {
      const turnstile = globalThis.turnstile;

      if (!turnstile) {
        reject(new Error("Turnstile not loaded"));
        return;
      }

      turnstile.render("#cf-turnstile", {
        sitekey,
        appearance: "execute",
        callback: (token: string) => resolve(token),
        "error-callback": () => reject(new Error("Captcha failed")),
        retry: "auto",
      });
      turnstile.execute("#cf-turnstile");
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

  // This unified function is used by both onSubmit and language-change re-validation.
  // Wrapped in useCallback to ensure stable reference for useEffect dependency.
  const validateForm = useCallback(
    (form: HTMLFormElement | null): {
      success: boolean;
      data?: ContactInput;
      errors: Record<string, string>;
    } => {
      if (!form) {
        return { success: false, errors: {} };
      }

      const fd = new FormData(form);
      const getStringValue = (key: string): string => {
        const value = fd.get(key);
        return typeof value === "string" ? value : "";
      };
      const formData = {
        name: getStringValue("name"),
        email: getStringValue("email"),
        subject: getStringValue("subject"),
        message: getStringValue("message"),
      };

      const parsed = ContactSchema.safeParse(formData);
      if (!parsed.success) {
        return {
          success: false,
          errors: mapIssues(parsed.error.issues),
        };
      }

      return {
        success: true,
        data: parsed.data,
        errors: {},
      };
    },
    [ContactSchema]
  );

  useEffect(() => {
    if (Object.keys(errs).length === 0) return;
    if (!formRef.current) return;

    const result = validateForm(formRef.current);
    if (result.success) {
      setErrs({});
    } else {
      setErrs(result.errors);
      setError(t("form.error.fix_fields", "Please fix the highlighted fields."));
    }
  }, [i18n.language, t, errs, validateForm]);

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

    // Use unified validation function
    const validationResult = validateForm(form);
    if (!validationResult.success) {
      setErrs(validationResult.errors);
      setError(t("form.error.fix_fields", "Please fix the highlighted fields."));
      return;
    }

    // Extract additional fields needed for submission (honeypot, timestamp)
    const fd = new FormData(form);
    const companyValue = fd.get("company");
    const data = {
      ...validationResult.data!,
      company: typeof companyValue === "string" ? companyValue : "",
      ts,
    };

    // Honeypot: si el bot llena "company", simulamos éxito pero no guardamos nada
    if (data.company) {
      setOk(t("form.success", "Thanks! We’ll get back to you shortly."));
      form.reset();
      return;
    }

    try {
      setSending(true);

      if (ENV.TURNSTILE_SITEKEY) {
        try {
          await getTurnstileToken(ENV.TURNSTILE_SITEKEY);
        } catch (err) {
          console.warn("Turnstile skipped:", err);
        }
      }

      // Guardar el mensaje en Firestore (sin Cloud Functions)
      // Using typed collection reference for type safety
      const contactMessage: ContactMessageInput = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ts: data.ts,
        createdAt: serverTimestamp(),
        lang: i18n.language,
      };
      await addDoc(contactMessagesRef, contactMessage);

      setOk(t("form.success", "Thanks! We’ll get back to you shortly."));
      setError("");
      form.reset();
    } catch (err: unknown) {
      console.error("Contact submit failed:", err);
      setOk("");

      const message =
        err instanceof Error
          ? err.message
          : t("form.error.network", "Network error. Please try again.");

      setError(message);
    } finally {
      setSending(false);
    }
  };

  type FormFieldName = "name" | "email" | "subject" | "message";

  const errId = (field: FormFieldName) =>
    `field-${field}-error`;

  // Helper functions to reduce cognitive complexity
  const getPlaceholderDefault = (field: FormFieldName): string => {
    const defaults: Record<FormFieldName, string> = {
      name: "Your name",
      email: "Your email",
      subject: "Subject",
      message: "Your message",
    };
    return defaults[field];
  };

  const getAutoComplete = (field: FormFieldName): "name" | "email" | "off" => {
    if (field === "name") return "name";
    if (field === "email") return "email";
    return "off";
  };

  const getInputType = (field: FormFieldName): string => {
    return field === "email" ? "email" : "text";
  };

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
            aria-describedby={(() => {
              if (error) return "form-error";
              if (ok) return "form-success";
              return undefined;
            })()}
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
              const placeholder = t(`form.placeholder.${field}`, {
                defaultValue: getPlaceholderDefault(field),
              }) || undefined;

              const common =
                "w-full rounded-app border border-[var(--primary)] text-[--text] placeholder-[--muted] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]";

              const autoComplete = getAutoComplete(field);
              const inputType = getInputType(field);
              const invalid = Boolean(errs[field]);
              const errorId = errId(field);

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
                      placeholder={placeholder}
                      className={`${common} px-4 py-3 glow-pulse`}
                      autoComplete="off"
                      required
                      aria-required="true"
                      aria-invalid={invalid}
                      aria-describedby={invalid ? errorId : undefined}
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={inputType}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      className={`${common} h-12 px-4 glow-pulse`}
                      required
                      aria-required="true"
                      aria-invalid={invalid}
                      aria-describedby={invalid ? errorId : undefined}
                    />
                  )}

                  {errs[field] && (
                    <p
                      id={errorId}
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
              <p id="form-error" role="alert" className="text-sm text-[var(--danger)]">
                {error}
              </p>
            )}
            {ok && (
              <p
                id="form-success"
                aria-live="polite"
                className="text-sm text-[var(--green-light)]"
              >
                {ok}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
