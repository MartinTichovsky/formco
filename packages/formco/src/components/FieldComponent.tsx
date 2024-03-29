import React from "react";
import { CN } from "../constants";
import { FormFields, ValidationResult } from "../controller.types";
import { SelectProvider } from "../providers";
import {
  FieldInitialProps,
  FieldInternalProps,
  FieldPrivateInputProps,
  FieldPrivateProps,
  FieldState,
  FieldType
} from "./Field.types";

export function FieldComponent<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> &
      (ElementType extends HTMLInputElement
        ? FieldPrivateInputProps<ElementType>
        : FieldPrivateProps<ElementType>)
  >,
  MComponent extends React.ElementType,
  ElementType,
  HTMLAttributesType
>({
  children,
  Component,
  controller,
  disableIf,
  hideMessage,
  hideIf,
  hideRequiredStar,
  initialValidation,
  label,
  MessageComponent,
  name,
  onFormChange,
  requiredComponent,
  requiredInvalidMessage,
  requiredValidMessage,
  validation,
  validateOnBlur,
  validateOnChange,
  validationDependencies,
  value,
  ...rest
}: React.PropsWithChildren<
  React.ComponentProps<
    FieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
  > &
    FieldInternalProps &
    FieldInitialProps
>) {
  const { initialState, fieldType, ...restProps } = rest;
  const [state, setState] = React.useState<FieldState>({
    ...initialState!,
    isOnFirstPosition: controller.isOnFirstPosition(name, rest.id),
    isSelected:
      rest.type === "checkbox"
        ? controller.getFieldValue(name) === true
        : controller.getFieldValue(name) === value
  });
  const refState = React.useRef<FieldState>();
  refState.current = state;

  const ref = React.useRef<HTMLSelectElement | HTMLInputElement>();
  const defaultValue = React.useRef(controller.getFieldValue(name) || "");
  const key = React.useRef(0);
  const onBlur = React.useRef<
    React.FocusEventHandler<HTMLInputElement> | undefined
  >(undefined);

  React.useEffect(
    () => {
      if (
        rest.type === "radio" &&
        rest.id &&
        controller.getFieldValue(name) === value
      ) {
        controller.setDefaultActiveRadioId(name, rest.id);
      }

      if (
        rest.type === "radio" &&
        ((rest.required && !hideRequiredStar) || !hideMessage)
      ) {
        const action = () => {
          const isOnFirstPosition = controller.isOnFirstPosition(name, rest.id);

          if (
            (!refState.current?.isOnFirstPosition && isOnFirstPosition) ||
            (refState.current?.isOnFirstPosition && !isOnFirstPosition)
          ) {
            setState((prevState) => ({ ...prevState, isOnFirstPosition }));
          }
        };

        controller.subscribeOnChange(action, name);

        return () => {
          controller.unsubscribeOnChange(action, name);
          controller.deleteField(name, rest.id);
        };
      }

      return () => {
        controller.deleteField(name, rest.id);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, refState]
  );

  if (validation && !onBlur.current) {
    onBlur.current = () => {
      controller.validateOnBlur(name);
    };
  }

  if (validation) {
    React.useEffect(
      () => {
        const action = (
          validationResult: ValidationResult,
          submitAction: boolean
        ) => {
          if (hideMessage) {
            return;
          }

          const field = controller.getField(name);
          const isValid =
            field === undefined ||
            (field.validationInProgress ? undefined : field.isValid);

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

          if (
            validationResult &&
            (refState.current!.message !== validationResult ||
              refState.current!.isValid !== isValid)
          ) {
            setState((prevState) => ({
              ...prevState,
              isValid,
              message: validationResult
            }));
          } else if (
            !validationResult &&
            (refState.current!.message !== undefined ||
              refState.current?.isValid !== isValid)
          ) {
            setState((prevState) => ({
              ...prevState,
              isValid,
              message: undefined
            }));
          }
        };

        controller.subscribeValidator({
          action,
          id: rest.id,
          key: name,
          type: rest.type,
          validation: () => {
            return validation(
              controller.getFieldValue(name),
              controller.getObservedFields(name),
              rest
            );
          }
        });

        return () => {
          controller.unsubscribeValidator(name, action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, hideMessage, name, setState, validation]
    );
  }

  React.useEffect(
    () => {
      const action = {
        action: (disable: boolean) => {
          if (disable !== refState.current!.isDisabled) {
            setState((prevState) => ({
              ...prevState,
              isDisabled: disable
            }));
          }
        },
        key: name
      };

      controller.subscribeOnDisable(action);

      return () => {
        controller.unsubscribeOnDisable(action);
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller, name, setState]
  );

  if (disableIf) {
    React.useEffect(() => {
      const action = () => {
        const isDisabled = disableIf(controller.fields);

        controller.setIsDisabled({
          id: rest.id,
          isDisabled,
          key: name,
          type: rest.type
        });

        if (isDisabled && !refState.current!.isDisabled) {
          key.current++;

          setState((prevState) => ({
            ...prevState,
            isDisabled: true,
            isSelected:
              (rest.type === "checkbox" &&
                controller.getFieldValue(name) === true) ||
              controller.getFieldValue(name) === value,
            isValid: undefined,
            message: undefined
          }));
        } else if (!isDisabled && refState.current!.isDisabled) {
          setState((prevState) => ({
            ...prevState,
            isDisabled: false
          }));
        }
      };

      controller.subscribeOnChange(action);

      return () => {
        controller.unsubscribeOnChange(action);
      };
    }, [controller, disableIf, key, name, refState, setState]);
  }

  if (onFormChange) {
    React.useEffect(
      () => {
        const action = () => {
          onFormChange(name, rest);
        };

        controller.subscribeOnChange(action);

        return () => {
          controller.unsubscribeOnChange(action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, name, onFormChange]
    );
  }

  if (hideIf) {
    React.useEffect(
      () => {
        const action = () => {
          const isVisible = !hideIf(controller.fields);

          controller.setIsVisible({
            id: rest.id,
            isVisible,
            key: name,
            type: rest.type
          });

          if (!isVisible && refState.current!.isVisible) {
            setState((prevState) => ({
              ...prevState,
              isOnFirstPosition: controller.isOnFirstPosition(name, rest.id),
              isVisible: false
            }));
          } else if (isVisible && !refState.current!.isVisible) {
            key.current++;

            setState((prevState) => ({
              ...prevState,
              isSelected:
                (rest.type === "checkbox" &&
                  controller.getFieldValue(name) === true) ||
                controller.getFieldValue(name) === value,
              isOnFirstPosition: controller.isOnFirstPosition(name, rest.id),
              isVisible: true
            }));
          }
        };

        controller.subscribeOnChange(action);

        return () => {
          controller.unsubscribeOnChange(action);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, hideIf, setState]
    );
  }

  if (rest.type === "radio" && rest.id) {
    React.useEffect(
      () => {
        controller.subscribeIsSelected(rest.id!, () => {
          key.current++;
          const field = controller.getField(name);

          setState((prevState) => ({
            ...prevState,
            isSelected: true,
            isValid: field === undefined || field.isValid,
            message:
              prevState.message && validation
                ? validation(
                    field?.value as T[K],
                    controller.getObservedFields(name),
                    rest
                  )
                : undefined
          }));
        });

        return () => {
          controller.unsubscribeIsSelected(rest.id!);
        };
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, setState]
    );
  }

  if (fieldType === "select") {
    React.useEffect(
      () => {
        let proceedValidation = true;

        const _ref = ref as React.MutableRefObject<HTMLSelectElement>;

        if (_ref && _ref.current && _ref.current.options) {
          proceedValidation =
            Array.prototype.filter.call(
              _ref.current.options,
              (option) => option.value && !option.disabled
            ).length > 0;
        }

        controller.setFieldValue({
          id: rest.id,
          isValid: proceedValidation ? undefined : true,
          key: name,
          silent: true,
          value: _ref.current?.value
        });
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, ref]
    );
  }

  const ComponentElement = React.useCallback(
    (props: React.ComponentProps<React.ElementType>) =>
      fieldType === "select" ? (
        Component ? (
          React.createElement(
            Component,
            { ...restProps, ...props, controller, onBlur: onBlur.current, ref },
            <SelectProvider
              id={rest.id}
              name={name as string}
              selectRef={ref as React.MutableRefObject<HTMLSelectElement>}
            >
              {children}
            </SelectProvider>
          )
        ) : (
          <select {...restProps} {...props} onBlur={onBlur.current} ref={ref}>
            <SelectProvider
              id={rest.id}
              name={name as string}
              selectRef={ref as React.MutableRefObject<HTMLSelectElement>}
            >
              {children}
            </SelectProvider>
          </select>
        )
      ) : Component ? (
        React.createElement(
          Component,
          { ...restProps, ...props, controller, onBlur: onBlur.current, ref },
          children
        )
      ) : fieldType === "textarea" ? (
        <textarea {...restProps} {...props} onBlur={onBlur.current} ref={ref} />
      ) : (
        <input {...restProps} {...props} onBlur={onBlur.current} ref={ref} />
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Component, fieldType]
  );

  const MessageElement = React.useCallback(
    ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLProps<HTMLElement>>) =>
      MessageComponent ? (
        React.createElement(
          MessageComponent,
          {
            ...restProps,
            ...props,
            controller
          } as React.ComponentProps<React.ElementType>,
          children
        )
      ) : (
        <span {...props}>{children}</span>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [MessageComponent]
  );

  if (!state.isVisible) {
    return null;
  }

  let props = {
    defaultChecked: false,
    defaultValue: value || (defaultValue.current as string)
  };

  if ((rest.type === "checkbox" || rest.type === "radio") && state.isSelected) {
    props.defaultChecked = true;
  }

  return (
    <>
      {rest.type !== "checkbox" &&
        rest.type !== "radio" &&
        (typeof label === "string" ? (
          <>
            <label htmlFor={rest.id}>{label}</label>{" "}
          </>
        ) : (
          label
        ))}
      <ComponentElement
        {...restProps}
        {...props}
        className={
          state.isValid === undefined
            ? rest.required
              ? `${rest.className} ${CN.Required}`
              : rest.className
            : `${rest.className !== undefined ? `${rest.className} ` : ""}${
                rest.required ? `${CN.Required} ` : ""
              }${state.isValid === false ? CN.InvalidField : CN.ValidField}`
        }
        disabled={state.isDisabled}
        key={key.current}
        name={name as string}
        onChange={(
          event: React.ChangeEvent<{ checked: boolean; value: string }>
        ) =>
          controller.setFieldValue({
            id: rest.id,
            isTouched: true,
            key: name,
            value:
              rest.type === "checkbox"
                ? event.currentTarget.checked
                : event.currentTarget.value
          })
        }
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === "Enter") {
            controller.submit();
          }
        }}
      />
      {(rest.type === "checkbox" || rest.type === "radio") &&
        (typeof label === "string" ? (
          <>
            {" "}
            <label htmlFor={rest.id}>{label}</label>
          </>
        ) : (
          label
        ))}
      {rest.required &&
        !hideRequiredStar &&
        state.isOnFirstPosition &&
        (requiredComponent ? (
          requiredComponent
        ) : (
          <span className={CN.RequiredStar}>*</span>
        ))}
      {((state.message && (state.message !== true || requiredInvalidMessage)) ||
        (state.isValid && requiredValidMessage)) &&
        state.isOnFirstPosition && (
          <MessageElement
            className={
              state.isValid === undefined
                ? CN.Message
                : `${CN.Message} ${
                    state.isValid === false
                      ? CN.InvalidMessage
                      : CN.ValidMessage
                  }`
            }
          >
            {state.message && state.message !== true
              ? state.message
              : state.isValid
              ? requiredValidMessage
              : requiredInvalidMessage}
          </MessageElement>
        )}
    </>
  );
}
