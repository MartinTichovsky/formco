import React from "react";
import {
  FormFields,
  PrivateProps,
  ValidationResult
} from "../private-controller.types";
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
  id,
  name,
  onValidation,
  privateController,
  validation,
  ...rest
}: React.PropsWithChildren<React.ComponentProps<FieldType<T, K, IComponent>>> &
  PrivateProps<T>) => {
  const [props, setProps] =
    React.useState<React.ComponentProps<React.ElementType>>(rest);
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
            privateController.scrollToError &&
            ref.current &&
            privateController.canScrollToElement
          ) {
            ref.current.scrollTo();
            ref.current.focus();
          }
        };

        privateController.subscribeValidator({
          action,
          id,
          key: name,
          validation: () =>
            validation(
              privateController.getFieldValue(name),
              privateController.getObservedFields(name)
            )
        });

        return () => {
          privateController.unsubscribeValidator(name, action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [privateController, name, refProps, setProps, validation]
    );
  }

  React.useEffect(() => {
    const onValidationAction =
      onValidation ||
      ((
        isFieldValid: boolean,
        setProps: React.Dispatch<React.SetStateAction<typeof rest>>,
        validationInProgress: boolean
      ) => {
        if (validationInProgress) {
          setProps((prevProps) => ({ ...prevProps, error: undefined }));
          return;
        }

        if (isFieldValid) {
          setProps((prevProps) => ({ ...prevProps, error: undefined }));
        } else {
          setProps((prevProps) => ({ ...prevProps, error: true }));
        }
      });

    const action = () => {
      onValidationAction(
        privateController.isFieldValid(name) === true,
        setProps,
        privateController.isFieldValidationInProgress(name) === true ||
          privateController.isFieldValidationToBeExecuted(name) === true
      );
    };

    privateController.subscribeOnChange(action, name);

    return () => {
      privateController.unsubscribeOnChange(action, name);
    };
  }, [privateController, name, onValidation, setProps]);

  if (validation && !onBlur.current) {
    onBlur.current = () => {
      privateController.validateOnBlur(name);
    };
  }

  return React.createElement(
    Component,
    {
      ...props,
      id,
      name,
      onBlur: onBlur.current,
      onChange: (
        event: React.ChangeEvent<{ checked: boolean; value: string }>
      ) =>
        privateController.setFieldValue({
          id,
          isTouched: true,
          key: name,
          value: event.currentTarget.value
        }),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
          privateController.submit();
        }
      },
      ref
    },
    children
  );
};
