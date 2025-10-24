// src/components/organisms/Contact.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H2, Lead } from "../atoms/Heading";
import Button from "../atoms/Button";
import { useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import { MailIcon, PinIcon, ClockIcon } from "../atoms/Icons";
import type { ReactNode, FormEvent } from "react";

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
    <div className="flex items-start  gap-5 rounded-app border-transparent bg-tranparent p-4 ">
      <div
        className="
          inline-grid h-15 w-15 place-items-center rounded-2xl
          text-[--white]
          bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]
          shadow-soft
        "
        aria-hidden
      >
        <div className="h-6 w-6 text-[var(--white)] ">{icon}</div>
      </div>

      <div className="min-w-0">
        <p className="text-md font-semibold text-[--text]">{title}</p>
        <p className="text-sm text-[--muted] truncate">{subtitle}</p>
      </div>
    </div>
  );
}

function validateFields(f: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  if (f.name.trim().length < 2) return "Name is too short.";
  if (!emailOk) return "Invalid email.";
  if (f.subject.trim().length < 2) return "Subject is too short.";
  if (f.message.trim().length < 10) return "Message is too short.";
  return null;
}

export function Contact() {
  const { t } = useTranslation();
  useReveal();

  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [ts] = useState(() => Date.now()); // marca de tiempo para bots rápidos

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOk("");

    // tiempo mínimo de llenado (2.5s)
    if (Date.now() - ts < 2500) {
      setError("Please take a moment to complete the form.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      company: String(fd.get("company") || ""), // honeypot
      ts,
    };

    const v = validateFields(data);
    if (v) {
      setError(v);
      return;
    }

    // si el honeypot viene relleno, simulamos OK y salimos
    if (data.company) {
      setOk("Thanks! We’ll get back to you shortly.");
      (e.currentTarget as HTMLFormElement).reset();
      return;
    }

    try {
      setSending(true);
      // con proxy de Vite, /api/contact apunta al emulador
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload?.error ?? "There was a problem sending your message.");
        setOk("");
        return;
      }

      setOk("Thanks! We’ll get back to you shortly.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setError("Network error. Please try again.");
      setOk("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-shell text-body scroll-mt-20 bg-grad-1">
      <Container>
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t("contact.title")}</H2>
          <Lead className="mt-3">{t("contact.blurb")}</Lead>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Left */}
          <div className="space-y-4 reveal ">
            <InfoRow
              icon={<MailIcon />}
              title={t("contact.email.label", "Escríbenos")}
              subtitle={t("contact.email.value", "hello@kinaltech.com")}
            />
            <InfoRow
              icon={<PinIcon />}
              title={t("contact.location.label", "Ubicación")}
              subtitle={t("contact.location.value", "Equipo remoto global")}
            />
            <InfoRow
              icon={<ClockIcon />}
              title={t("contact.hours.label", "Horario")}
              subtitle={t("contact.hours.value", "Lunes – Viernes: 9AM – 6PM")}
            />
          </div>

          {/* Right: form */}
          <form onSubmit={onSubmit} className="space-y-4 reveal" noValidate>
            {/* Honeypot accesible pero oculto visualmente */}
            <label htmlFor="company" className="sr-only">Company</label>
            <input
              id="company"
              name="company"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
            />
            {/* timestamp de carga */}
            <input type="hidden" name="ts" value={ts} />

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
                "w-full rounded-app border border-[var(--muted)] text-[--text] placeholder-[--muted] focus:shadow-md focus:shadow-blue-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]  focus:border-[var(--primary)] transition duration-200";

              return (
                <div key={field}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={field}>
                    {label}
                  </label>

                  {isTextArea ? (
                    <textarea id={field} name={field} rows={6} placeholder={ph} className={`${common} px-4 py-3`} />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      autoComplete={field === "email" ? "email" : "off"}
                      placeholder={ph}
                      className={`${common} h-12 px-4`}
                    />
                  )}
                </div>
              );
            })}

            <Button
              type="submit"
              className="mt-2 h-13 w-50  bg-gradient-to-r from-[var(--primary)] 
            to-[var(--accent)] shadow-lg hover:shadow-xl hover:shadow-blue-600/20 "
              disabled={sending}
            >
              {sending ? "Sending..." : t("form.send")}
            </Button>

            {error && <p className="text-sm text-[--danger]">{error}</p>}
            {ok && <p className="text-sm text-emerald-500">{ok}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
}
