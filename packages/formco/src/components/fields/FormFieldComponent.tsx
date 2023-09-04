import * as React from "react";
import { CN } from "../../constants";
import { FormFields, PrivateProps, ValidationResult, Value } from "../../private-controller.types";
import { SelectProvider } from "../../providers";
import {
    FormFieldComponentInitialProps,
    FormFieldComponentState,
    FormFieldComponentType,
    FormFieldInternalProps,
    FormFieldPrivateProps
} from "./FormField.types";

export function FormFieldComponent<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & FormFieldPrivateProps>,
    MComponent extends React.ElementType
>({
    children,
    component: Component,
    controller,
    fieldType,
    disableIf,
    hideMessage,
    hideIf,
    hideRequiredStar,
    id,
    initialState,
    label,
    messageComponent: MessageComponent,
    name,
    onBlur,
    onChange,
    onFormChange,
    onKeyDown,
    privateController,
    required,
    requiredComponent,
    requiredInvalidMessage,
    requiredValidMessage,
    rest,
    type,
    validateOnBlur,
    validation,
    value
}: React.PropsWithChildren<FormFieldComponentType<T, K, IComponent, MComponent>> &
    FormFieldInternalProps &
    FormFieldComponentInitialProps &
    PrivateProps<T>) {
    const [state, setState] = React.useState<FormFieldComponentState>({
        ...initialState,
        isOnFirstPosition: privateController.isOnFirstPosition(name, id),
        isSelected:
            type === "checkbox"
                ? privateController.getFieldValue(name) === true
                : privateController.getFieldValue(name) === value
    });

    const keyRef = React.useRef(0);
    const ref = React.useRef<HTMLSelectElement | HTMLInputElement>();

    const stateRef = React.useRef(state);
    stateRef.current = state;

    React.useEffect(() => {
        if (type === "radio" && id && privateController.getFieldValue(name) === value) {
            privateController.setDefaultActiveRadioId(name, id);
        }

        if (type === "radio" && ((required && !hideRequiredStar) || !hideMessage)) {
            const action = () => {
                const isOnFirstPosition = privateController.isOnFirstPosition(name, id);

                if (
                    (!stateRef.current.isOnFirstPosition && isOnFirstPosition) ||
                    (stateRef.current.isOnFirstPosition && !isOnFirstPosition)
                ) {
                    setState((prevState) => ({
                        ...prevState,
                        isOnFirstPosition
                    }));
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
    }, [hideMessage, hideRequiredStar, id, name, privateController, required, stateRef, type]);

    React.useEffect(() => {
        if (!validation) {
            return;
        }

        const action = (validationResult: ValidationResult, submitAction: boolean) => {
            if (hideMessage) {
                return;
            }

            const field = privateController.getField(name);
            const isValid = field === undefined || (field.validationInProgress ? undefined : field.isValid);

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
                (stateRef.current.message !== validationResult || stateRef.current.isValid !== isValid)
            ) {
                setState((prevState) => ({
                    ...prevState,
                    isValid,
                    message: validationResult
                }));
            } else if (
                !validationResult &&
                (stateRef.current.message !== undefined || stateRef.current.isValid !== isValid)
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
                validation(privateController.getFieldValue(name), privateController.getObservedFields(name))
        });

        return () => {
            privateController.unsubscribeValidator(name, action);
        };
    }, [hideMessage, id, name, privateController, setState, type, validation]);

    React.useEffect(() => {
        const action = {
            action: (disable: boolean) => {
                if (disable !== stateRef.current.isDisabled) {
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

    React.useEffect(() => {
        if (!disableIf) {
            return;
        }

        const action = () => {
            const isDisabledResult = disableIf(privateController.fieldsData);
            let isDisabled = false;
            let newValue: Value | undefined;

            if (typeof isDisabledResult === "object" && "isDisabled" in isDisabledResult) {
                isDisabled = isDisabledResult.isDisabled;
                newValue = isDisabledResult.value;
            } else {
                isDisabled = isDisabledResult;
            }

            privateController.setIsDisabled({
                id,
                isDisabled,
                key: name,
                type,
                value: newValue
            });

            if (isDisabled && !stateRef.current.isDisabled) {
                // changing key helps to set a defaultValue to show the correct text
                keyRef.current++;

                setState((prevState) => ({
                    ...prevState,
                    isDisabled: true,
                    isSelected:
                        (type === "checkbox" && privateController.getFieldValue(name) === true) ||
                        privateController.getFieldValue(name) === value,
                    isValid: undefined,
                    message: undefined
                }));
            } else if (!isDisabled && stateRef.current.isDisabled) {
                // changing key helps to set a defaultValue to show the correct text
                keyRef.current++;

                setState((prevState) => ({
                    ...prevState,
                    isDisabled: false,
                    isSelected:
                        (type === "checkbox" && privateController.getFieldValue(name) === true) ||
                        privateController.getFieldValue(name) === value
                }));
            }
        };

        privateController.subscribeOnChange(action);

        return () => {
            privateController.unsubscribeOnChange(action);
        };
    }, [disableIf, id, keyRef, name, privateController, stateRef, setState, type, value]);

    React.useEffect(() => {
        if (!onFormChange) {
            return;
        }

        const action = () => {
            onFormChange(name);
        };

        privateController.subscribeOnChange(action);

        return () => {
            privateController.unsubscribeOnChange(action);
        };
    }, [name, onFormChange, privateController]);

    React.useEffect(() => {
        if (!hideIf) {
            return;
        }

        const action = () => {
            const isVisible = !hideIf(privateController.fieldsData);

            privateController.setIsVisible({
                id,
                isVisible,
                key: name,
                type
            });

            if (!isVisible && stateRef.current.isVisible) {
                setState((prevState) => ({
                    ...prevState,
                    isOnFirstPosition: privateController.isOnFirstPosition(name, id),
                    isVisible: false
                }));
            } else if (isVisible && !stateRef.current.isVisible) {
                keyRef.current++;

                setState((prevState) => ({
                    ...prevState,
                    isSelected:
                        (type === "checkbox" && privateController.getFieldValue(name) === true) ||
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

    React.useEffect(() => {
        if (type !== "radio" || !id) {
            return;
        }

        privateController.subscribeIsSelected(id!, () => {
            keyRef.current++;
            const field = privateController.getField(name);

            setState((prevState) => ({
                ...prevState,
                isSelected: true,
                isValid: field === undefined || field.isValid,
                message:
                    prevState.message && validation
                        ? validation(field?.value as T[K], privateController.getObservedFields(name))
                        : undefined
            }));
        });

        return () => {
            privateController.unsubscribeIsSelected(id!);
        };
    }, [id, name, privateController, setState]);

    React.useEffect(() => {
        if (fieldType !== "select") {
            return;
        }

        let proceedValidation = true;

        const _ref = ref as React.MutableRefObject<HTMLSelectElement>;

        if (_ref && _ref.current && _ref.current.options) {
            proceedValidation =
                Array.prototype.filter.call(_ref.current.options, (option) => option.value && !option.disabled).length >
                0;
        }

        privateController.setFieldValue({
            id,
            isValid: proceedValidation ? undefined : true,
            key: name,
            silent: true,
            value: _ref.current?.value
        });
    }, [id, name, privateController, ref]);

    const onBlurHandler = React.useCallback((event: React.ChangeEvent<Element>) => {
        privateController.setFieldProperties(name, {
            isTouched: true
        });

        if (validation && validateOnBlur) {
            privateController.validateOnBlur(name);
        }
        onBlur?.(event);
    }, []);

    const onChangeHandler = React.useCallback(
        (
            event: React.ChangeEvent<
                Element & {
                    checked: boolean;
                    value: string;
                }
            >
        ) => {
            privateController.setFieldValue({
                id,
                isTouched: true,
                key: name,
                value: type === "checkbox" ? event.target.checked : event.target.value
            });
            onChange?.(event);
        },
        [id, name, privateController, type]
    );

    const onKeyDownHandler = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter") {
                privateController.submit();
            }
            onKeyDown?.(event);
        },
        [privateController]
    );

    const ComponentElement = React.useCallback(
        (props: React.ComponentProps<React.ElementType>) =>
            fieldType === "select" ? (
                Component ? (
                    React.createElement(
                        Component,
                        {
                            ...rest,
                            ...props,
                            controller,
                            ref
                        },
                        <SelectProvider
                            id={id}
                            name={name as string}
                            selectRef={ref as React.MutableRefObject<HTMLSelectElement>}
                        >
                            {children}
                        </SelectProvider>
                    )
                ) : (
                    <select {...rest} {...props} ref={ref}>
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
                    {
                        ...rest,
                        ...props,
                        controller,
                        ref
                    },
                    children
                )
            ) : fieldType === "textarea" ? (
                <textarea {...rest} {...props} ref={ref} />
            ) : (
                <input {...rest} {...props} ref={ref} />
            ),
        [Component, fieldType]
    );

    const MessageElement = React.useCallback(
        ({ children, ...props }: React.PropsWithChildren<React.HTMLProps<HTMLElement>>) =>
            MessageComponent ? (
                React.createElement(MessageComponent, { ...rest, ...props, controller }, children)
            ) : (
                <span {...props}>{children}</span>
            ),
        [MessageComponent]
    );

    const props = {
        defaultChecked: false,
        defaultValue:
            value ??
            React.useMemo(() => privateController.getFieldValue(name) || "", [keyRef.current, privateController])
    };

    if (!state.isVisible) {
        return null;
    }

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
                key={keyRef.current}
                name={name as string}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
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
                (requiredComponent ? requiredComponent : <span className={CN.RequiredStar}>*</span>)}
            {((state.message && (state.message !== true || requiredInvalidMessage)) ||
                (state.isValid && requiredValidMessage)) &&
                state.isOnFirstPosition && (
                    <MessageElement
                        className={
                            state.isValid === undefined
                                ? CN.Message
                                : `${CN.Message} ${state.isValid === false ? CN.InvalidMessage : CN.ValidMessage}`
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
