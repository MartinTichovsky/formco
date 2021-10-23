import React from "react";
import { FormFields } from "../private-controller.types";
import { FormControllerComponentProps } from "./FormController.types";
import { FormControllerComponent } from "./FormControllerComponent";

export const FormController = <T extends FormFields<T>>(
  props: FormControllerComponentProps<T>
) => {
  if (
    props.initialValues !== undefined &&
    (typeof props.initialValues !== "object" ||
      props.initialValues === null ||
      Array.isArray(props.initialValues))
  ) {
    throw new Error("InitialValues values must be an object");
  }

  if (props.onSubmit !== undefined && typeof props.onSubmit !== "function") {
    throw new Error("OnSubmit is not a function");
  }

  return <FormControllerComponent {...props} />;
};
