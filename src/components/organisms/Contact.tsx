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
  icon: ReactNode;     // <-- antes: JSX.Element
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start text-[var(--text)] gap-4 rounded-app border-transparent bg-tranparent p-4 ">
      <div
        className="
          inline-grid h-12 w-12 place-items-center rounded-2xl
          text-[--white]
          bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]
          shadow-soft
        "
        aria-hidden
      >
        <div className="h-6 w-6">{icon}</div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[--text]">{title}</p>
        <p className="text-sm text-[--muted] truncate">{subtitle}</p>
      </div>
    </div>
  );
}

export function Contact() {
  const { t } = useTranslation();
  const [ok, setOk] = useState("");
  useReveal();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !email) {
      setOk("");
      return;
    }
    setOk(`${name}, te contactamos pronto a ${email}.`);
    e.currentTarget.reset();
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
          {/* Left: info blocks */}
          <div className="space-y-4 reveal">
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
          <form onSubmit={onSubmit} className="space-y-4 reveal">
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
                    <textarea
                      id={field}
                      name={field}
                      rows={6}
                      placeholder={ph}
                      className={`${common} px-4 py-3`}
                    />
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

            <Button type="submit" className="mt-2">
              {t("form.send")}
            </Button>

            {ok && <p className="text-sm text-emerald-500">{ok}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
}
