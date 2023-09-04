import * as React from "react";
import { FormFields } from "../private-controller.types";
import { ValidationProvider } from "../providers";
import { ValidationProps } from "./Validation.types";

export const Validation = <T extends FormFields<T>>({
    children,
    disableIf,
    hideIf,
    hideMessage,
    hideRequiredStar,
    required,
    requiredComponent,
    requiredInvalidMessage,
    requiredValidMessage,
    validation
}: ValidationProps<T>) => {
    return (
        <ValidationProvider<T>
            hideMessage={hideMessage}
            hideRequiredStar={hideRequiredStar}
            disableIf={disableIf}
            hideIf={hideIf}
            required={required}
            requiredComponent={requiredComponent}
            requiredInvalidMessage={requiredInvalidMessage}
            requiredValidMessage={requiredValidMessage}
            validation={validation}
        >
            {children}
        </ValidationProvider>
    );
};
