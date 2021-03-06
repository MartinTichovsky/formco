import React from "react";
import { Controller } from "../controller";
import { FormFields } from "../controller.types";
import { FormControllerComponentProps } from "./FormController.types";

export const FormControllerComponent = <T extends FormFields<T>>({
  children,
  disableIf,
  hideIf,
  initialValues,
  options,
  onSubmit,
  requiredInvalidMessage,
  requiredValidMessage,
  validateOnBlur = false,
  validateOnChange = false,
  validation,
  ...rest
}: FormControllerComponentProps<T>) => {
  const [controller, setController] = React.useState<Controller<T>>();

  React.useEffect(
    () => {
      const controller = new Controller<T>({
        disableIf,
        hideIf,
        initialValues,
        options,
        onSubmit,
        requiredInvalidMessage,
        requiredValidMessage,
        setController,
        validateOnBlur,
        validateOnChange,
        validation
      });
      setController(controller);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [setController, validateOnChange]
  );

  React.useEffect(() => {
    if (controller) {
      controller.initialRenderDone();
      controller.onChange();
    }
  }, [controller]);

  if (controller === undefined) {
    return null;
  }

  return (
    <form
      {...rest}
      aria-label="form"
      className="form-controller"
      key={controller.key}
      onSubmit={(event) => event.preventDefault()}
    >
      {children(controller)}
    </form>
  );
};
