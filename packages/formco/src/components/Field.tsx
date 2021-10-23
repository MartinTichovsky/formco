import React from "react";
import { FormFields } from "../private-controller.types";
import { usePrivateController } from "../providers";
import { FieldPrivateProps, FieldType } from "./Field.types";
import { FieldComponent } from "./FieldComponent";

let idCounter = 0;

const getRandomId = () => `field-${++idCounter}`;

export const Field = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps
  >
>(
  props: React.PropsWithChildren<
    React.ComponentProps<FieldType<T, K, IComponent>>
  >
) => {
  const privateController = usePrivateController<T>();

  if (!props.name || typeof props.name !== "string") {
    throw new Error("Name must be a string");
  }

  return (
    <FieldComponent
      {...props}
      id={props.id ? props.id : getRandomId()}
      privateController={privateController}
    />
  );
};
