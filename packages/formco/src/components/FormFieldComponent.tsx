import React from "react";
import { CN } from "../constants";
import {
  FormFields,
  PrivateProps,
  ValidationResult
} from "../private-controller.types";
import { SelectProvider } from "../providers";
import {
  FormFieldInitialProps,
  FormFieldInternalProps,
  FormFieldPrivateProps,
  FormFieldState,
  FormFieldType
} from "./FormField.types";

export function FormFieldComponent<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FormFieldPrivateProps
  >,
  MComponent extends React.ElementType,
  ElementType,
  HTMLAttributesType
>({
  children,
  component: Component,
  controller,
  disableIf,
  fieldType,
  hideMessage,
  hideIf,
  hideRequiredStar,
  id,
  initialState,
  initialValidation,
  label,
  messageComponent: MessageComponent,
  name,
  onFormChange,
  privateController,
  required,
  requiredComponent,
  requiredInvalidMessage,
  requiredValidMessage,
  type,
  validation,
  validateOnBlur,
  validateOnChange,
  validationDependencies,
  value,
  ...rest
}: React.PropsWithChildren<
  React.ComponentProps<
    FormFieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType>
  >
> &
  FormFieldInternalProps &
  FormFieldInitialProps &
  PrivateProps<T>) {
  const [state, setState] = React.useState<FormFieldState>({
    ...initialState!,
    isOnFirstPosition: privateController.isOnFirstPosition(name, id),
    isSelected:
      type === "checkbox"
        ? privateController.getFieldValue(name) === true
        : privateController.getFieldValue(name) === value
  });

  const defaultValue = React.useRef(
    privateController.getFieldValue(name) || ""
  );
  const key = React.useRef(0);
  const onBlur = React.useRef<React.FocusEventHandler | undefined>(undefined);
  const ref = React.useRef<HTMLSelectElement | HTMLInputElement>();
  const refState = React.useRef<FormFieldState>();

  refState.current = state;

  React.useEffect(() => {
    if (
      type === "radio" &&
      id &&
      privateController.getFieldValue(name) === value
    ) {
      privateController.setDefaultActiveRadioId(name, id);
    }

    if (type === "radio" && ((required && !hideRequiredStar) || !hideMessage)) {
      const action = () => {
        const isOnFirstPosition = privateController.isOnFirstPosition(name, id);

        if (
          (!refState.current?.isOnFirstPosition && isOnFirstPosition) ||
          (refState.current?.isOnFirstPosition && !isOnFirstPosition)
        ) {
          setState((prevState) => ({ ...prevState, isOnFirstPosition }));
        }
      };

      privateController.subscribeOnChange(action, name);

      return () => {
        privateController.unsubscribeOnChange(action, name);
        privateController.deleteField(name, id);
      };
    }

    return () => {
      privateController.deleteField(name, id);
    };
  }, [
    hideMessage,
    hideRequiredStar,
    id,
    name,
    privateController,
    required,
    refState,
    type
  ]);

  if (validation && !onBlur.current) {
    onBlur.current = () => {
      privateController.validateOnBlur(name);
    };
  }

  if (validation) {
    React.useEffect(() => {
      const action = (
        validationResult: ValidationResult,
        submitAction: boolean
      ) => {
        if (hideMessage) {
          return;
        }

        const field = privateController.getField(name);
        const isValid =
          field === undefined ||
          (field.validationInProgress ? undefined : field.isValid);

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

      privateController.subscribeValidator({
        action,
        id,
        key: name,
        type,
        validation: () =>
          validation(
            privateController.getFieldValue(name),
            privateController.getObservedFields(name)
          )
      });

      return () => {
        privateController.unsubscribeValidator(name, action);
      };
    }, [hideMessage, id, name, privateController, setState, type, validation]);
  }

  React.useEffect(() => {
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

    privateController.subscribeOnDisable(action);

    return () => {
      privateController.unsubscribeOnDisable(action);
    };
  }, [name, privateController, setState]);

  if (disableIf) {
    React.useEffect(() => {
      const action = () => {
        const isDisabled = disableIf(privateController.fields);

        privateController.setIsDisabled({
          id,
          isDisabled,
          key: name,
          type
        });

        if (isDisabled && !refState.current!.isDisabled) {
          key.current++;

          setState((prevState) => ({
            ...prevState,
            isDisabled: true,
            isSelected:
              (type === "checkbox" &&
                privateController.getFieldValue(name) === true) ||
              privateController.getFieldValue(name) === value,
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

      privateController.subscribeOnChange(action);

      return () => {
        privateController.unsubscribeOnChange(action);
      };
    }, [
      disableIf,
      id,
      key,
      name,
      privateController,
      refState,
      setState,
      type,
      value
    ]);
  }

  if (onFormChange) {
    React.useEffect(() => {
      const action = () => {
        onFormChange(name);
      };

      privateController.subscribeOnChange(action);

      return () => {
        privateController.unsubscribeOnChange(action);
      };
    }, [name, onFormChange, privateController]);
  }

  if (hideIf) {
    React.useEffect(() => {
      const action = () => {
        const isVisible = !hideIf(privateController.fields);

        privateController.setIsVisible({
          id,
          isVisible,
          key: name,
          type
        });

        if (!isVisible && refState.current!.isVisible) {
          setState((prevState) => ({
            ...prevState,
            isOnFirstPosition: privateController.isOnFirstPosition(name, id),
            isVisible: false
          }));
        } else if (isVisible && !refState.current!.isVisible) {
          key.current++;

          setState((prevState) => ({
            ...prevState,
            isSelected:
              (type === "checkbox" &&
                privateController.getFieldValue(name) === true) ||
              privateController.getFieldValue(name) === value,
            isOnFirstPosition: privateController.isOnFirstPosition(name, id),
            isVisible: true
          }));
        }
      };

      privateController.subscribeOnChange(action);

      return () => {
        privateController.unsubscribeOnChange(action);
      };
    }, [hideIf, id, name, privateController, setState, type, value]);
  }

  if (type === "radio" && id) {
    React.useEffect(() => {
      privateController.subscribeIsSelected(id!, () => {
        key.current++;
        const field = privateController.getField(name);

        setState((prevState) => ({
          ...prevState,
          isSelected: true,
          isValid: field === undefined || field.isValid,
          message:
            prevState.message && validation
              ? validation(
                  field?.value as T[K],
                  privateController.getObservedFields(name)
                )
              : undefined
        }));
      });

      return () => {
        privateController.unsubscribeIsSelected(id!);
      };
    }, [id, name, privateController, setState]);
  }

  if (fieldType === "select") {
    React.useEffect(() => {
      let proceedValidation = true;

      const _ref = ref as React.MutableRefObject<HTMLSelectElement>;

      if (_ref && _ref.current && _ref.current.options) {
        proceedValidation =
          Array.prototype.filter.call(
            _ref.current.options,
            (option) => option.value && !option.disabled
          ).length > 0;
      }

      privateController.setFieldValue({
        id,
        isValid: proceedValidation ? undefined : true,
        key: name,
        silent: true,
        value: _ref.current?.value
      });
    }, [id, name, privateController, ref]);
  }

  const ComponentElement = React.useCallback(
    (props: React.ComponentProps<React.ElementType>) =>
      fieldType === "select" ? (
        Component ? (
          React.createElement(
            Component,
            { ...rest, ...props, controller, onBlur: onBlur.current, ref },
            <SelectProvider
              id={id}
              name={name as string}
              selectRef={ref as React.MutableRefObject<HTMLSelectElement>}
            >
              {children}
            </SelectProvider>
          )
        ) : (
          <select {...rest} {...props} onBlur={onBlur.current} ref={ref}>
            <SelectProvider
              id={id}
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
          { ...rest, ...props, controller, onBlur: onBlur.current, ref },
          children
        )
      ) : fieldType === "textarea" ? (
        <textarea {...rest} {...props} onBlur={onBlur.current} ref={ref} />
      ) : (
        <input {...rest} {...props} onBlur={onBlur.current} ref={ref} />
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
          { ...rest, ...props, controller },
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
    defaultValue: value || defaultValue.current
  };

  if ((type === "checkbox" || type === "radio") && state.isSelected) {
    props.defaultChecked = true;
  }

  return (
    <>
      {type !== "checkbox" &&
        type !== "radio" &&
        (typeof label === "string" ? (
          <>
            <label htmlFor={id}>{label}</label>{" "}
          </>
        ) : (
          label
        ))}
      <ComponentElement
        {...rest}
        {...props}
        className={
          state.isValid === undefined
            ? required
              ? `${rest.className} ${CN.Required}`
              : rest.className
            : `${rest.className !== undefined ? `${rest.className} ` : ""}${
                required ? `${CN.Required} ` : ""
              }${state.isValid === false ? CN.InvalidField : CN.ValidField}`
        }
        disabled={state.isDisabled}
        id={id}
        key={key.current}
        name={name as string}
        onChange={(
          event: React.ChangeEvent<{ checked: boolean; value: string }>
        ) =>
          privateController.setFieldValue({
            id,
            isTouched: true,
            key: name,
            value:
              type === "checkbox" ? event.target.checked : event.target.value
          })
        }
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === "Enter") {
            privateController.submit();
          }
        }}
        type={type}
      />
      {(type === "checkbox" || type === "radio") &&
        (typeof label === "string" ? (
          <>
            {" "}
            <label htmlFor={id}>{label}</label>
          </>
        ) : (
          label
        ))}
      {required &&
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
