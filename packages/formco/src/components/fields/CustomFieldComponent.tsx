import * as React from "react";
import { FormFields, PrivateProps, ValidationResult } from "../../private-controller.types";
import { CustomFieldComponentType, CustomFieldPrivateProps } from "./CustomField.types";

export const CustomFieldComponent = <
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & CustomFieldPrivateProps>
>({
    component: Component,
    initialValidation,
    children,
    controller,
    disableIf,

    hideIf,
    id,
    name,
    onBlur,
    onChange,
    onKeyDown,
    onValidation,
    privateController,
    provideValue,
    required,
    rest,
    useDefaultOnValidation,
    validation,
    validateOnBlur,
    validateOnChange
}: React.PropsWithChildren<CustomFieldComponentType<T, K, IComponent>> & PrivateProps<T>) => {
    const [props, setProps] = React.useState<React.ComponentProps<React.ElementType>>({});
    const ref = React.useRef<HTMLElement>();
    const propsRef = React.useRef(props);
    propsRef.current = props;

    const defaultValue = rest["defaultValue"]
        ? rest["defaultValue"]
        : React.useMemo(() => privateController.getFieldValue(name) || "", [privateController]);

    React.useEffect(
        () => {
            if (!validation) {
                return;
            }

            const action = (validationResult: ValidationResult, submitAction: boolean) => {
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
                    validation(privateController.getFieldValue(name), privateController.getObservedFields(name))
            });

            return () => {
                privateController.unsubscribeValidator(name, action);
            };
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [privateController, name, propsRef, setProps, validation]
    );

    React.useEffect(() => {
        if (!onValidation && !useDefaultOnValidation) {
            return;
        }

        const onValidationAction =
            onValidation ||
            ((
                isFieldValid: boolean,
                setProps: React.Dispatch<React.SetStateAction<typeof rest>>,
                validationInProgress: boolean
            ) => {
                if (validationInProgress) {
                    setProps((prevProps) => ({
                        ...prevProps,
                        error: undefined
                    }));
                    return;
                }

                if (isFieldValid) {
                    setProps((prevProps) => ({
                        ...prevProps,
                        error: undefined
                    }));
                } else {
                    setProps((prevProps) => ({ ...prevProps, error: true }));
                }
            });

        const listener = {
            action: () => {
                if (privateController.canFieldBeValidated(name, true)) {
                    onValidationAction(
                        privateController.isFieldValid(name) === true,
                        setProps,
                        privateController.isFieldValidationInProgress(name) === true ||
                            privateController.isFieldValidationToBeExecuted(name) === true
                    );
                }
            },
            key: name
        };

        privateController.subscribeOnValidation(listener);

        return () => {
            privateController.unsubscribeOnValidation(listener);
        };
    }, [privateController, name, onValidation, setProps]);

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
                    type: string;
                    value: string;
                }
            >
        ) => {
            privateController.setFieldValue({
                id,
                isTouched: true,
                key: name,
                value: event.target.type === "checkbox" ? event.target.checked : event.target.value
            });

            if (provideValue) {
                setProps((prevProps: typeof rest) => ({
                    ...prevProps,
                    value: event.target.value
                }));
            }
            onChange?.(event);
        },
        [id, name, privateController]
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

    return React.createElement(
        Component,
        {
            ...rest,
            ...props,
            defaultValue,
            id,
            name,
            onBlur: onBlurHandler,
            onChange: onChangeHandler,
            onKeyDown: onKeyDownHandler,
            ref
        },
        children
    );
};
