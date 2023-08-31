import * as React from "react";
import { FormFields, OnValidationCustom } from "../../private-controller.types";
import { usePrivateController } from "../../providers";
import { CustomFieldPrivateProps, CustomFieldType } from "./CustomField.types";
import { CustomFieldComponent } from "./CustomFieldComponent";

let idCounter = 0;

const getRandomId = () => `field-${++idCounter}`;

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
    $validateOnBlur,
    $validateOnChange,
    $validation,
    children,
    ...rest
}: React.PropsWithChildren<React.ComponentProps<CustomFieldType<T, K, IComponent>>>) => {
    const privateController = usePrivateController<T>();

    if (!$name || typeof $name !== "string") {
        throw new Error("Name must be a string");
    }

    $onValidation = $onValidation || privateController.getOnValidationCondition($name);

    return (
        <CustomFieldComponent
            children={children}
            component={$component}
            controller={$controller}
            data-testid={rest["data-testid"]}
            disableIf={$disableIf}
            hideIf={$hideIf}
            id={$id ? $id : getRandomId()}
            initialValidation={$initialValidation}
            name={$name}
            onBlur={$onBlur}
            onChange={$onChange}
            onKeyDown={$onKeyDown}
            onValidation={$onValidation as OnValidationCustom}
            privateController={privateController}
            provideValue={$provideValue}
            rest={rest}
            validateOnBlur={$validateOnBlur}
            validateOnChange={$validateOnChange}
            validation={$validation}
        />
    );
};
