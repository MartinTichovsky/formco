import * as React from "react";
import { FormFields, OnValidationCustom } from "../../private-controller.types";
import {
    commonPropsContext,
    disableIfContext,
    hideIfContext,
    usePrivateController,
    validationContext
} from "../../providers";
import { CustomFieldPrivateProps, CustomFieldType } from "./CustomField.types";
import { CustomFieldComponent } from "./CustomFieldComponent";
import { InitialState } from "./FormField.types";

export const CustomField = <
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & CustomFieldPrivateProps>
>({
    $component,
    $controller,
    $disableIf,
    $hideIf,
    $id,
    $initialValidation,
    $name,
    $onBlur,
    $onChange,
    $onKeyDown,
    $onValidation,
    $provideValue,
    $required,
    $useDefaultOnValidation,
    $validateOnBlur,
    $validateOnChange,
    $validation,
    children,
    ...rest
}: React.PropsWithChildren<React.ComponentProps<CustomFieldType<T, K, IComponent>>>) => {
    const privateController = usePrivateController<T>();

    if ($disableIf !== undefined && typeof $disableIf !== "function") {
        throw new Error("DisableIf is not a function");
    }

    if (!$name || typeof $name !== "string") {
        throw new Error("Name must be a string");
    }

    if ($validation !== undefined && typeof $validation !== "function") {
        throw new Error("Validation is not a function");
    }

    React.useEffect(() => {
        if (!privateController.registerKey($name, "text")) {
            console.warn(`Key '${$name}' is already registered in the form`);
        }
    }, [$name, privateController]);

    const providedProps = {
        $disableIf,
        $hideIf,
        $required,
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

    let validationUpdated = providedProps.$validation;

    if (providedProps.$required && providedProps.$validation) {
        validationUpdated = ((value: T[K] | undefined, fields: Partial<T>) => {
            return (typeof value === "string" ? !value.trim() : value === undefined)
                ? true
                : providedProps.$validation!(value, fields);
        }) as typeof providedProps.$validation;
    } else if (providedProps.$required) {
        validationUpdated = (value: T[K] | undefined) =>
            typeof value === "string" ? !value.trim() : typeof value === "boolean" ? !value : value === undefined;
    }

    if ($initialValidation !== undefined || $validateOnBlur !== undefined || $validateOnChange !== undefined) {
        privateController.setFieldProperties($name, {
            initialValidation: $initialValidation,
            validateOnBlur: $validateOnBlur,
            validateOnChange: $validateOnChange
        });
    }

    const globalOptions = privateController.getOptions();

    if ($validateOnBlur === undefined) {
        $validateOnBlur = globalOptions.validateOnBlur;
    }

    const validationResult =
        validationUpdated &&
        validationUpdated(privateController.getFieldValue($name), privateController.getObservedFields($name));

    const disableIfResult = providedProps.$disableIf ? providedProps.$disableIf(privateController.fieldsData) : false;

    const initialState: InitialState = {
        isDisabled:
            typeof disableIfResult === "object" && "isDisabled" in disableIfResult
                ? disableIfResult.isDisabled
                : disableIfResult,
        isVisible: providedProps.$hideIf ? !providedProps.$hideIf(privateController.fieldsData) : true,
        message: $initialValidation ? privateController.getValidationResultContent(validationResult) : undefined
    };

    if (initialState.isDisabled) {
        privateController.setDefaultIsDisabled({
            id: $id,
            isValidated: !!($initialValidation && validationUpdated),
            key: $name,
            validationResult: $initialValidation ? validationResult : undefined
        });
    } else if (!initialState.isVisible) {
        privateController.setDefaultIsNotVisible({
            id: $id,
            isValidated: !!($initialValidation && validationUpdated),
            key: $name,
            validationResult: $initialValidation ? validationResult : undefined,
            value: rest["defaultValue"] || privateController.getFieldValue($name) || children
        });
    } else if (validationUpdated) {
        privateController.setDefaultIsValid({
            initialValidation: $initialValidation,
            isValidated: true,
            key: $name,
            validationResult
        });
    }

    const field = privateController.getField($name);
    initialState.isValid = $initialValidation ? !validationResult && (field === undefined || field.isValid) : undefined;

    return (
        <CustomFieldComponent
            children={children}
            component={$component}
            controller={$controller}
            data-testid={rest["data-testid"]}
            disableIf={providedProps.$disableIf}
            hideIf={providedProps.$hideIf}
            id={$id}
            initialState={initialState}
            initialValidation={$initialValidation}
            name={$name}
            onBlur={$onBlur}
            onChange={$onChange}
            onKeyDown={$onKeyDown}
            onValidation={$onValidation as OnValidationCustom}
            privateController={privateController}
            provideValue={$provideValue}
            required={providedProps.$required}
            rest={rest}
            useDefaultOnValidation={$useDefaultOnValidation}
            validateOnBlur={$validateOnBlur}
            validateOnChange={$validateOnChange}
            validation={validationUpdated}
        />
    );
};
