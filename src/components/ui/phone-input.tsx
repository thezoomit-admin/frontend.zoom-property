"use client";

import { useId } from "react";
import PhoneInput, {
  type Country,
  type Value,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { cn } from "cn";

const DEFAULT_COUNTRY: Country = "BD";

type Props = {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  defaultCountry?: Country;
};

/**
 * Phone field with country flag — Bangladesh by default.
 * Value is E.164 (e.g. +8801712345678). Hidden input keeps FormData `name`.
 */
export function PhoneNumberInput({
  id,
  name = "phone",
  value,
  onChange,
  placeholder = "01712-345678",
  disabled,
  required,
  autoComplete = "tel",
  className,
  defaultCountry = DEFAULT_COUNTRY,
}: Props) {
  const fallbackId = useId();
  const inputId = id || fallbackId;
  const phoneValue = (value || undefined) as Value | undefined;

  return (
    <div className={cn("PhoneNumberInput", className)}>
      <PhoneInput
        id={inputId}
        international
        defaultCountry={defaultCountry}
        countryCallingCodeEditable={false}
        value={phoneValue}
        onChange={(next) => onChange?.(next || "")}
        placeholder={placeholder}
        disabled={disabled}
        numberInputProps={{
          autoComplete,
          required,
          name: undefined,
          "aria-required": required || undefined,
        }}
        className="PhoneNumberInput-control PhoneInput"
      />
      {/* Keeps FormData `name` in sync — validation is handled in the form submit. */}
      <input type="hidden" name={name} value={value || ""} />
    </div>
  );
}
