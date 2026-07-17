"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careersSchema, type CareersInput } from "@/lib/validations/careers";
import { submitApplication } from "@/lib/actions/careers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, controlClass } from "./form-field";
import {
  FormStatusBanner,
  FormSubmitButton,
  type FormStatus,
} from "./form-feedback";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

type FormDict = Dictionary["careers"]["form"];

export function CareersForm({ lang, dict }: { lang: Locale; dict: FormDict }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>("idle");
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

      <FormStatusBanner
        status={status}
        successTitle={dict.successTitle}
        successDesc={dict.successDesc}
        errorTitle={dict.errorTitle}
        errorDesc={dict.errorDesc}
      />

      <FormSubmitButton
        isPending={isPending}
        label={dict.submit}
        pendingLabel={dict.sending}
      />
    </form>
  );
}
