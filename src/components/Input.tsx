import React from "react";
import { FormFields } from "../controller.types";
import { FieldPrivateInputProps, FieldType } from "./Field.types";
import { FieldContainer } from "./FieldContainer";

export function Input<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateInputProps<HTMLInputElement>
  >,
  MComponent extends React.ElementType
>(
  props: React.ComponentProps<
    FieldType<
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
    <FieldContainer<
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
