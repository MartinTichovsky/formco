import React from "react";
import { Controller } from "../controller";
import { FormFields } from "../controller.types";
import { SubmitComponentType, SubmitPrivateProps } from "./Submit.types";
import { SubmitComponent } from "./SubmitComponent";

export const Submit = <
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
>(
  props: React.PropsWithChildren<
    React.ComponentProps<SubmitComponentType<T, BComponent>>
  >
) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (props.onSubmit !== undefined && typeof props.onSubmit !== "function") {
    throw new Error("OnSubmit is not a function");
  }

  return <SubmitComponent {...props} />;
};
