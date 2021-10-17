import React from "react";
import { Controller } from "../controller";
import { FormFields } from "../controller.types";
import { FieldType } from "./Field.types";
import { FieldComponent } from "./FieldComponent";

let idCounter = 0;

const getRandomId = () => `field-${++idCounter}`;

export const Field = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<React.ComponentProps<IComponent>>
>(
  props: React.PropsWithChildren<
    React.ComponentProps<FieldType<T, K, IComponent>>
  >
) => {
  const { controller, name } = props;

  if (!(controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (!name || typeof name !== "string") {
    throw new Error("Name must be a string");
  }

  const providedProps = {
    id: props.id
  };

  providedProps.id = providedProps.id ? providedProps.id : getRandomId();

  return <FieldComponent {...props} {...providedProps} />;
};
