import React from "react";
import { FormFields } from "../controller.types";
import { FieldPrivateProps, FieldType } from "./Field.types";
import { FieldContainer } from "./FieldContainer";

export function Select<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps<HTMLSelectElement>
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
        HTMLSelectElement,
        React.SelectHTMLAttributes<HTMLSelectElement>
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
      HTMLSelectElement,
      React.SelectHTMLAttributes<HTMLSelectElement>
    >
      {...props}
      fieldType="select"
    />
  );
}
