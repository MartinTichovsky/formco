import { CommonFormFieldProps } from "./components/fields/FormField.types";
import { DisableIf, HideIf, ValidationResult, Value } from "./private-controller.types";

export type OnChangeCondition = ((fields: {}) => boolean) | undefined;

export interface SelectProviderProps {
    id?: string;
    name: string;
    selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
}

export type ValidationAction = (value: Value, fields: {}) => ValidationResult;

export interface ValidationProviderProps<T> {
    readonly disableIf?: DisableIf<T>;
    readonly hideIf?: HideIf<T>;
    readonly hideMessage?: CommonFormFieldProps["$hideMessage"];
    readonly hideRequiredStar?: CommonFormFieldProps["$hideRequiredStar"];
    readonly required?: CommonFormFieldProps["$required"];
    readonly requiredComponent?: CommonFormFieldProps["$requiredComponent"];
    readonly requiredInvalidMessage?: CommonFormFieldProps["$requiredInvalidMessage"];
    readonly requiredValidMessage?: CommonFormFieldProps["$requiredValidMessage"];
    readonly validation?: ValidationAction;
}
