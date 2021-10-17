import React from "react";
import { FormFields, ValidationResult } from "../controller.types";
import { FieldType } from "./Field.types";

export const FieldComponent = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<React.ComponentProps<IComponent>>
>({
  children,
  component: Component,
  controller,
  name,
  onValidation,
  validation,
  ...rest
}: React.PropsWithChildren<
  React.ComponentProps<FieldType<T, K, IComponent>>
>) => {
  const [props, setProps] = React.useState(rest);
  const ref = React.useRef<HTMLElement>();
  const refProps = React.useRef(props);
  refProps.current = props;

  if (validation) {
    React.useEffect(
      () => {
        const action = (
          validationResult: ValidationResult,
          submitAction: boolean
        ) => {
          if (
            validationResult &&
            submitAction &&
            controller.scrollToError &&
            ref.current &&
            controller.canScrollToElement
          ) {
            ref.current.scrollTo();
            ref.current.focus();
          }

          if (onValidation) {
            onValidation(!validationResult, setProps);
          }
        };

        controller.subscribeValidator({
          action,
          id: rest.id,
          key: name,
          validation: () => {
            return validation(
              controller.getFieldValue(name),
              controller.getObservedFields(name),
              refProps.current
            );
          }
        });

        return () => {
          controller.unsubscribeValidator(name, action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, name, refProps, setProps, validation]
    );
  }

  return React.createElement(Component as any, {
    ...props,
    onChange: (event: React.ChangeEvent<{ checked: boolean; value: string }>) =>
      controller.setFieldValue({
        id: rest.id,
        isTouched: true,
        key: name,
        value: event.currentTarget.value
      }),
    ref
  });
};
