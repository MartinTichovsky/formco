import React from "react";
import {
  invalidFieldClassName,
  invalidMessageClassName,
  messageClassName,
  requiredClassName,
  requiredStarClassName,
  validFieldClassName,
  validMessageClassName
} from "../../constants";
import { FormFields, ValidationResult } from "../../controller.types";
import { SelectProvider } from "../../providers";
import {
  FieldInitialProps,
  FieldInternalProps,
  FieldPrivateInputProps,
  FieldPrivateProps,
  FieldState,
  FieldType
} from "./types";

export function Field<
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

  const selectRef = React.useRef<HTMLSelectElement>();
  const defaultValue = React.useRef(controller.getFieldValue(name) || "");
  const key = React.useRef(0);

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

  if (validation) {
    React.useEffect(
      () => {
        const action = (validationResult: ValidationResult) => {
          if (hideMessage) {
            return;
          }

          const field = controller.getField(name);
          const isValid =
            field === undefined ||
            (field.validationInProgress ? undefined : field.isValid);

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

        if (selectRef && selectRef.current && selectRef.current.options) {
          proceedValidation =
            Array.prototype.filter.call(
              selectRef.current.options,
              (option) => option.value && !option.disabled
            ).length > 0;
        }

        controller.setFieldValue({
          id: rest.id,
          isValid: proceedValidation ? undefined : true,
          key: name,
          silent: true,
          value: selectRef.current?.value
        });
      }, // eslint-disable-next-line react-hooks/exhaustive-deps
      [controller, selectRef]
    );
  }

  const ComponentElement = React.useCallback(
    (props: React.ComponentProps<React.ElementType>) =>
      fieldType === "select" ? (
        Component ? (
          <Component
            {...restProps}
            {...props}
            controller={controller}
            ref={selectRef}
          >
            <SelectProvider
              id={rest.id}
              name={name as string}
              selectRef={selectRef}
            >
              {children}
            </SelectProvider>
          </Component>
        ) : (
          <select {...restProps} {...props} ref={selectRef}>
            <SelectProvider
              id={rest.id}
              name={name as string}
              selectRef={selectRef}
            >
              {children}
            </SelectProvider>
          </select>
        )
      ) : Component ? (
        <Component {...restProps} {...props} controller={controller}>
          {children}
        </Component>
      ) : fieldType === "textarea" ? (
        <textarea {...restProps} {...props} />
      ) : (
        <input {...restProps} {...props} />
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
        <MessageComponent
          {...({
            ...restProps,
            ...props,
            controller
          } as React.ComponentProps<React.ElementType>)}
        >
          {children}
        </MessageComponent>
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
              ? `${rest.className} ${requiredClassName}`
              : rest.className
            : `${rest.className !== undefined ? `${rest.className} ` : ""}${
                rest.required ? `${requiredClassName} ` : ""
              }${
                state.isValid === false
                  ? invalidFieldClassName
                  : validFieldClassName
              }`
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
          <span className={requiredStarClassName}>*</span>
        ))}
      {((state.message && (state.message !== true || requiredInvalidMessage)) ||
        (state.isValid && requiredValidMessage)) &&
        state.isOnFirstPosition && (
          <MessageElement
            className={
              state.isValid === undefined
                ? messageClassName
                : `${messageClassName} ${
                    state.isValid === false
                      ? invalidMessageClassName
                      : validMessageClassName
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
