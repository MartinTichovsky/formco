import React from "react";
import { FormFields } from "../controller.types";
import { FormField } from "./FormField";
import { FormFieldPrivateInputProps, FormFieldType } from "./FormField.types";

export function Input<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FormFieldPrivateInputProps
  >,
  MComponent extends React.ElementType
>(
  props: React.ComponentProps<
    FormFieldType<
      T,
      K,
      IComponent,
      MComponent,
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >
  >
) {
  return (
    <FormField<
      T,
      K,
      IComponent,
      MComponent,
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >
      {...props}
      fieldType="input"
    />
  );
}
