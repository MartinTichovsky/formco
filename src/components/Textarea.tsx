import React from "react";
import { FormFields } from "../controller.types";
import { FieldPrivateProps, FieldType } from "./Field.types";
import { FieldContainer } from "./FieldContainer";

export function Textarea<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps<HTMLTextAreaElement>
  >,
  MComponent extends React.ElementType
>(
  props: React.PropsWithChildren<
    React.ComponentProps<
      FieldType<
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
    <FieldContainer<
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
