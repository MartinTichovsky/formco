import React from "react";
import { FormFields } from "../controller.types";
import { FormField } from "./FormField";
import { FormFieldPrivateProps, FormFieldType } from "./FormField.types";

export function Select<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FormFieldPrivateProps<HTMLSelectElement>
  >,
  MComponent extends React.ElementType
>(
  props: React.PropsWithChildren<
    React.ComponentProps<
      FormFieldType<
        T,
        K,
        IComponent,
        MComponent,
        HTMLSelectElement,
        React.SelectHTMLAttributes<HTMLSelectElement>
      >
    >
  >
) {
  return (
    <FormField<
      T,
      K,
      IComponent,
      MComponent,
      HTMLSelectElement,
      React.SelectHTMLAttributes<HTMLSelectElement>
    >
      {...props}
      fieldType="select"
    />
  );
}
