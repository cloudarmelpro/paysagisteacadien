"use client";

import { useState, useTransition } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContact } from "@/app/[lang]/nous-joindre/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Field, controlClass } from "./form-field";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

type FormDict = Dictionary["contact"]["form"];
type Status = "idle" | "success" | "error";
type Option = { value: string; label: string };

function DateField({
  control,
  lang,
  placeholder,
}: {
  control: Control<ContactInput>;
  lang: Locale;
  placeholder: string;
}) {
  const dfLocale = lang === "fr" ? fr : enUS;
  return (
    <Controller
      control={control}
      name="startDate"
      render={({ field }) => {
        const selected = field.value
          ? new Date(`${field.value}T00:00:00`)
          : undefined;
        return (
          <Popover>
            <PopoverTrigger
              id="contact-startDate"
              className={cn(
                controlClass,
                "flex items-center text-left",
                !field.value && "text-muted-foreground",
              )}
            >
              {selected
                ? format(selected, "d MMMM yyyy", { locale: dfLocale })
                : placeholder}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(d) =>
                  field.onChange(d ? format(d, "yyyy-MM-dd") : "")
                }
                disabled={{ before: startOfToday() }}
                locale={dfLocale}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}

function CheckboxGroup({
  control,
  name,
  label,
  options,
}: {
  control: Control<ContactInput>;
  name: "service" | "referral";
  label: string;
  options: Option[];
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = (field.value as string[]) ?? [];
        const toggle = (v: string, checked: boolean) =>
          field.onChange(
            checked ? [...value, v] : value.filter((x) => x !== v),
          );
        return (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-medium text-foreground">
              {label}
            </legend>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {options.map((opt) => {
                const id = `${name}-${opt.value}`;
                return (
                  <div key={opt.value} className="flex items-center gap-2.5">
                    <Checkbox
                      id={id}
                      checked={value.includes(opt.value)}
                      onCheckedChange={(checked) => toggle(opt.value, checked)}
                    />
                    <Label
                      htmlFor={id}
                      className="cursor-pointer font-normal text-foreground/80"
                    >
                      {opt.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        );
      }}
    />
  );
}

export function ContactForm({
  lang,
  dict,
  serviceOptions,
}: {
  lang: Locale;
  dict: FormDict;
  serviceOptions: Option[];
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      municipality: "",
      address: "",
      phone: "",
      service: [],
      startDate: "",
      referral: [],
      message: "",
    },
  });

  const err = (key?: string) =>
    key ? (dict.errors[key as keyof typeof dict.errors] ?? key) : undefined;
  const described = (field: keyof ContactInput) =>
    errors[field] ? `contact-${field}-error` : undefined;

  const referralOptions: Option[] = Object.entries(dict.referralOptions).map(
    ([value, label]) => ({ value, label }),
  );

  function onSubmit(values: ContactInput) {
    setStatus("idle");
    startTransition(async () => {
      const result = await submitContact(values, lang);
      if (result.status === "success") {
        setStatus("success");
        reset();
        return;
      }
      if (result.fieldErrors) {
        for (const [f, key] of Object.entries(result.fieldErrors)) {
          setError(f as keyof ContactInput, { message: key });
        }
      }
      setStatus("error");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Field id="contact-name" label={dict.name} error={err(errors.name?.message)}>
        <Input
          id="contact-name"
          autoComplete="name"
          placeholder={dict.namePlaceholder}
          aria-invalid={!!errors.name}
          aria-describedby={described("name")}
          className={controlClass}
          {...register("name")}
        />
      </Field>

      <Field id="contact-email" label={dict.email} error={err(errors.email?.message)}>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder={dict.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={described("email")}
          className={controlClass}
          {...register("email")}
        />
      </Field>

      <Field
        id="contact-municipality"
        label={dict.municipality}
        error={err(errors.municipality?.message)}
      >
        <Input
          id="contact-municipality"
          autoComplete="address-level2"
          placeholder={dict.municipalityPlaceholder}
          aria-invalid={!!errors.municipality}
          aria-describedby={described("municipality")}
          className={controlClass}
          {...register("municipality")}
        />
      </Field>

      <Field
        id="contact-address"
        label={dict.address}
        error={err(errors.address?.message)}
      >
        <Input
          id="contact-address"
          autoComplete="street-address"
          placeholder={dict.addressPlaceholder}
          aria-invalid={!!errors.address}
          aria-describedby={described("address")}
          className={controlClass}
          {...register("address")}
        />
      </Field>

      <Field id="contact-phone" label={dict.phone} error={err(errors.phone?.message)}>
        <Input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          placeholder={dict.phonePlaceholder}
          aria-invalid={!!errors.phone}
          aria-describedby={described("phone")}
          className={controlClass}
          {...register("phone")}
        />
      </Field>

      <Field id="contact-startDate" label={dict.startDate}>
        <DateField control={control} lang={lang} placeholder={dict.startDatePlaceholder} />
      </Field>

      <CheckboxGroup
        control={control}
        name="service"
        label={dict.service}
        options={serviceOptions}
      />

      <CheckboxGroup
        control={control}
        name="referral"
        label={dict.referral}
        options={referralOptions}
      />

      <Field
        id="contact-message"
        label={dict.message}
        error={err(errors.message?.message)}
      >
        <Textarea
          id="contact-message"
          rows={5}
          placeholder={dict.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={described("message")}
          {...register("message")}
          className="min-h-40 text-base"
        />
      </Field>

      {/* Retour d'envoi */}
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
