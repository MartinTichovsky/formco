import { Controller } from "../controller";
import {
    ControllerOptions,
    DisableIf,
    FormFields,
    HideIf,
    InitialValues,
    OnSubmit,
    OnValidationCustom,
    Validation
} from "../private-controller.types";

export type FormControllerComponentProps<T extends FormFields<T>> = FormControllerProps<T> &
    Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export type FormControllerProps<T extends FormFields<T>> = React.PropsWithChildren<{
    children: (controller: Controller<T>) => React.ReactNode;
    disableIf?: {
        [K in keyof T]?: DisableIf<T>;
    };
    hideIf?: {
        [K in keyof T]?: HideIf<T>;
    };
    initialValidation?: boolean;
    initialValues?: InitialValues<T>;
    options?: ControllerOptions;
    onSubmit?: OnSubmit<T>;
    onValidation?:
        | {
              [K in keyof T]?: OnValidationCustom;
          }
        | OnValidationCustom;
    requiredInvalidMessage?: string | JSX.Element;
    requiredValidMessage?: string | JSX.Element;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validation?: {
        [K in keyof T]?: Validation<T, K>;
    };
}>;
