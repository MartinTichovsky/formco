import React from "react";
import { FormFields } from "../private-controller.types";
import { usePrivateController } from "../providers";
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
  const privateController = usePrivateController<T>();

  if (props.onSubmit !== undefined && typeof props.onSubmit !== "function") {
    throw new Error("OnSubmit is not a function");
  }

  return <SubmitComponent {...props} privateController={privateController} />;
};
