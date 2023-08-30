import * as React from "react";
import { FormFields } from "../private-controller.types";
import {
    commonPropsContext,
    disableIfContext,
    hideIfContext,
    usePrivateController,
    validationContext
} from "../providers";
import { FormFieldInternalProps, FormFieldPrivateProps, FormFieldType, InitialState } from "./FormField.types";
import { FormFieldComponent } from "./FormFieldComponent";

let idCounter = 0;

const getRandomId = () => `form-field-${++idCounter}`;

export function FormField<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & FormFieldPrivateProps>,
    MComponent extends React.ElementType,
    ElementType,
    HTMLAttributesType
>({
    $component,
    $controller,
    $disableIf,
    $hideMessage,
    $hideIf,
    $hideRequiredStar,
    $id,
    $initialValidation,
    $label,
    $messageComponent,
    $name,
    $onFormChange,
    $required,
    $requiredComponent,
    $requiredInvalidMessage,
    $requiredValidMessage,
    $type,
    $validation,
    $validateOnBlur,
    $validateOnChange,
    $validationDependencies,
    $value,
    children,
    fieldType,
    ...rest
}: React.PropsWithChildren<
    FormFieldType<T, K, IComponent, MComponent, ElementType, HTMLAttributesType> & FormFieldInternalProps
>) {
    const privateController = usePrivateController<T>();

    if ($disableIf !== undefined && typeof $disableIf !== "function") {
        throw new Error("DisableIf is not a function");
    }

    if (!$name || typeof $name !== "string") {
        throw new Error("Name must be a string");
    }

    if ($onFormChange !== undefined && typeof $onFormChange !== "function") {
        throw new Error("OnFormChange is not a function");
    }

    if ($validation !== undefined && typeof $validation !== "function") {
        throw new Error("Validation is not a function");
    }

    if ($validationDependencies !== undefined && !Array.isArray($validationDependencies)) {
        throw new Error("ValidationDependencies must be an array");
    }

    if (!privateController.registerKey($name, $type || "text")) {
        console.warn(`Key '${$name}' is already registered in the form`);
    }

    if ($validationDependencies) {
        privateController.registerValidationDependencies($name, $validationDependencies);
    }

    const providedProps = {
        $disableIf,
        $hideIf,
        $hideMessage,
        $hideRequiredStar,
        $id,
        $required,
        $requiredComponent,
        $requiredInvalidMessage,
        $requiredValidMessage,
        $validation
    };

    if (!providedProps.$disableIf) {
        providedProps.$disableIf = React.useContext(disableIfContext);
    }

    if (!providedProps.$disableIf) {
        providedProps.$disableIf = privateController.getDisableCondition($name);
    }

    if (!providedProps.$hideIf) {
        providedProps.$hideIf = React.useContext(hideIfContext);
    }

    if (!providedProps.$hideIf) {
        providedProps.$hideIf = privateController.getHideCondition($name);
    }

    if (!providedProps.$validation) {
        providedProps.$validation = React.useContext(validationContext);
    }

    if (!providedProps.$validation) {
        providedProps.$validation = privateController.getValidationCondition($name);
    }

    const commonProps = React.useContext(commonPropsContext);

    for (let key in commonProps) {
        if (providedProps[key] === undefined) {
            providedProps[key] = commonProps[key];
        }
    }

    if (providedProps.$requiredInvalidMessage === undefined) {
        providedProps.$requiredInvalidMessage = privateController.requiredInvalidMessage;
    }

    if (providedProps.$requiredValidMessage === undefined) {
        providedProps.$requiredValidMessage = privateController.requiredValidMessage;
    }

    let _validation = providedProps.$validation;

    if (providedProps.$required && providedProps.$validation) {
        _validation = ((value: T[K] | undefined, fields: Partial<T>) => {
            if ($type === "checkbox" || $type === "radio" || fieldType === "select") {
                const validationResult = providedProps.$validation!(value, fields);

                return (
                    validationResult ||
                    (typeof value === "string" ? !value.trim() : $type === "checkbox" ? !value : value === undefined)
                );
            }

            return (typeof value === "string" ? !value.trim() : value === undefined)
                ? true
                : providedProps.$validation!(value, fields);
        }) as typeof providedProps.$validation;
    } else if (providedProps.$required) {
        _validation = (value: T[K] | undefined) =>
            typeof value === "string" ? !value.trim() : $type === "checkbox" ? !value : value === undefined;
    }

    if ($initialValidation !== undefined || $validateOnBlur !== undefined || $validateOnChange !== undefined) {
        privateController.setFieldProperties($name, {
            initialValidation: $initialValidation,
            validateOnBlur: $validateOnBlur,
            validateOnChange: $validateOnChange
        });
    }

    providedProps.$id = (
        ($label && !providedProps.$id) || $type === "radio" ? getRandomId() : providedProps.$id
    ) as typeof $id;

    if ($type === "radio") {
        privateController.registerOption($name, providedProps.$id!);
    }

    let validationResult =
        _validation && _validation(privateController.getFieldValue($name), privateController.getObservedFields($name));

    const initialState: InitialState = {
        isDisabled: providedProps.$disableIf ? providedProps.$disableIf(privateController.fields) : false,
        isVisible: providedProps.$hideIf ? !providedProps.$hideIf(privateController.fields) : true,
        message: $initialValidation ? privateController.getValidationResultContent(validationResult) : undefined
    };

    if (initialState.isDisabled) {
        privateController.setDefaultIsDisabled({
            id: providedProps.$id,
            isValidated: $type !== "radio" && !!($initialValidation && _validation),
            key: $name,
            type: $type,
            validationResult: $initialValidation ? validationResult : undefined
        });
    } else if (!initialState.isVisible) {
        privateController.setDefaultIsNotVisible({
            id: providedProps.$id,
            isValidated: $type !== "radio" && !!($initialValidation && _validation),
            key: $name,
            type: $type,
            validationResult: $initialValidation ? validationResult : undefined,
            value: $value || children
        });
    } else if (_validation) {
        privateController.setDefaultIsValid({
            initialValidation: $initialValidation,
            isValidated: $type !== "radio",
            key: $name,
            type: $type,
            validationResult
        });
    }

    const field = privateController.getField($name);
    initialState.isValid = $initialValidation ? !validationResult && (field === undefined || field.isValid) : undefined;

    return (
        <FormFieldComponent<T, K, IComponent, MComponent>
            children={children}
            component={$component}
            controller={$controller}
            data-testid={rest["data-testid"]}
            disableIf={providedProps.$disableIf}
            fieldType={fieldType}
            hideIf={providedProps.$hideIf}
            hideMessage={providedProps.$hideMessage}
            hideRequiredStar={providedProps.$hideRequiredStar}
            id={providedProps.$id}
            initialState={initialState}
            initialValidation={$initialValidation}
            label={$label}
            messageComponent={$messageComponent}
            name={$name}
            onFormChange={$onFormChange}
            privateController={privateController}
            required={providedProps.$required}
            requiredComponent={providedProps.$requiredComponent}
            requiredInvalidMessage={providedProps.$requiredInvalidMessage}
            requiredValidMessage={providedProps.$requiredValidMessage}
            rest={rest}
            type={$type}
            validateOnBlur={$validateOnBlur}
            validateOnChange={$validateOnChange}
            validation={_validation}
            validationDependencies={$validationDependencies}
            value={$value}
        />
    );
}
