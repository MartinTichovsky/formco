import { DisableIf, FormFields, HideIf, ValidationResult, Value } from "../private-controller.types";
import { CommonFormFieldComponentProps } from "./fields/FormField.types";

export type ValidationProps<T extends FormFields<T>> = React.PropsWithChildren<
    {
        disableIf?: DisableIf<T>;
        hideIf?: HideIf<T>;
        validation?: (value: Value, props: unknown) => ValidationResult;
    } & CommonFormFieldComponentProps
>;
