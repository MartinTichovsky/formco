import React from "react";
import { FormFields } from "../private-controller.types";
import { FormField } from "./FormField";
import { FormFieldPrivateProps, FormFieldType } from "./FormField.types";

export function Textarea<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FormFieldPrivateProps
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
        HTMLTextAreaElement,
        React.TextareaHTMLAttributes<HTMLTextAreaElement>
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
      HTMLTextAreaElement,
      React.TextareaHTMLAttributes<HTMLTextAreaElement>
    >
      {...props}
      fieldType="textarea"
    />
  );
}
