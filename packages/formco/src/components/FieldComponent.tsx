import React from "react";
import { FormFields, ValidationResult } from "../controller.types";
import { FieldPrivateProps, FieldType } from "./Field.types";

export const FieldComponent = <
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps
  >
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
  const onBlur = React.useRef<React.FocusEventHandler | undefined>(undefined);

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
        };

        controller.subscribeValidator({
          action,
          id: rest.id,
          key: name,
          validation: () =>
            validation(
              controller.getFieldValue(name),
              controller.getObservedFields(name),
              refProps.current
            )
        });

        return () => {
          controller.unsubscribeValidator(name, action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, name, refProps, setProps, validation]
    );
  }

  if (onValidation) {
    React.useEffect(() => {
      const action = () => {
        onValidation(
          controller.isFieldValid(name) === true,
          setProps,
          controller.isFieldValidationInProgress(name) === true ||
            controller.isFieldValidationToBeExecuted(name) === true
        );
      };

      controller.subscribeOnChange(action, name);

      return () => {
        controller.unsubscribeOnChange(action, name);
      };
    }, [controller, name, onValidation, setProps]);
  }

  if (validation && !onBlur.current) {
    onBlur.current = () => {
      controller.validateOnBlur(name);
    };
  }

  return React.createElement(Component, {
    ...props,
    name,
    onBlur: onBlur.current,
    onChange: (event: React.ChangeEvent<{ checked: boolean; value: string }>) =>
      controller.setFieldValue({
        id: rest.id,
        isTouched: true,
        key: name,
        value: event.currentTarget.value
      }),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        controller.submit();
      }
    },
    ref
  } as React.ComponentProps<React.ElementType>);
};
