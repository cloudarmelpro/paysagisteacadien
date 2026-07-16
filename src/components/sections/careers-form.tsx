"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { careersSchema, type CareersInput } from "@/lib/validations/careers";
import { submitApplication } from "@/app/[lang]/emplois/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, controlClass } from "./form-field";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

type FormDict = Dictionary["careers"]["form"];
type Status = "idle" | "success" | "error";

export function CareersForm({ lang, dict }: { lang: Locale; dict: FormDict }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CareersInput>({
    resolver: zodResolver(careersSchema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  const err = (key?: string) =>
    key ? (dict.errors[key as keyof typeof dict.errors] ?? key) : undefined;
  const described = (field: keyof CareersInput) =>
    errors[field] ? `careers-${field}-error` : undefined;

  function onSubmit(values: CareersInput) {
    setStatus("idle");
    startTransition(async () => {
      const result = await submitApplication(values, lang);
      if (result.status === "success") {
        setStatus("success");
        reset();
        return;
      }
      if (result.fieldErrors) {
        for (const [f, key] of Object.entries(result.fieldErrors)) {
          setError(f as keyof CareersInput, { message: key });
        }
      }
      setStatus("error");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Field id="careers-name" label={dict.name} error={err(errors.name?.message)}>
        <Input
          id="careers-name"
          autoComplete="name"
          placeholder={dict.namePlaceholder}
          aria-invalid={!!errors.name}
          aria-describedby={described("name")}
          className={controlClass}
          {...register("name")}
        />
      </Field>

      <Field id="careers-phone" label={dict.phone} error={err(errors.phone?.message)}>
        <Input
          id="careers-phone"
          type="tel"
          autoComplete="tel"
          placeholder={dict.phonePlaceholder}
          aria-invalid={!!errors.phone}
          aria-describedby={described("phone")}
          className={controlClass}
          {...register("phone")}
        />
      </Field>

      <Field id="careers-email" label={dict.email} error={err(errors.email?.message)}>
        <Input
          id="careers-email"
          type="email"
          autoComplete="email"
          placeholder={dict.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={described("email")}
          className={controlClass}
          {...register("email")}
        />
      </Field>

      <Field id="careers-message" label={dict.message} error={err(errors.message?.message)}>
        <Textarea
          id="careers-message"
          rows={8}
          placeholder={dict.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={described("message")}
          className="min-h-40 text-base"
          {...register("message")}
        />
      </Field>

      {/* Retour d'envoi — annoncé aux lecteurs d'écran. */}
      {status === "success" && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <strong className="font-medium">{dict.successTitle}.</strong>{" "}
            {dict.successDesc}
          </span>
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <strong className="font-medium">{dict.errorTitle}.</strong>{" "}
            {dict.errorDesc}
          </span>
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 self-start px-8 text-xs font-semibold tracking-wider uppercase"
      >
        {isPending ? (
          <>
            {dict.sending}
            <Loader2 className="size-4 animate-spin" aria-hidden />
          </>
        ) : (
          <>
            {dict.submit}
            <div className="size-4" aria-hidden>
              →
            </div>
          </>
        )}
      </Button>
    </form>
  );
}
