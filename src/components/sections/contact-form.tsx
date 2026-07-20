"use client";

import { useState, useTransition } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContact } from "@/lib/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Field, controlClass } from "./form-field";
import {
  FormStatusBanner,
  FormSubmitButton,
  type FormStatus,
} from "./form-feedback";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

type FormDict = Dictionary["contact"]["form"];
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
  const [status, setStatus] = useState<FormStatus>("idle");
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
      website: "",
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
      {/* Honeypot anti-bot : hors flux, masqué aux humains et aux lecteurs
          d'écran, hors tabulation. Un envoi où il est rempli est ignoré côté
          serveur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Laissez ce champ vide</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

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
