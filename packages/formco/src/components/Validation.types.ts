import { FormFields, ValidationResult, Value } from "../private-controller.types";
import { CommonFormFieldComponentProps } from "./FormField.types";

export type ValidationProps<T extends FormFields<T>> = React.PropsWithChildren<
    {
        disableIf?: (fields: Partial<T>) => boolean;
        hideIf?: (fields: Partial<T>) => boolean;
        validation?: (value: Value, props: unknown) => ValidationResult;
    } & CommonFormFieldComponentProps
>;
