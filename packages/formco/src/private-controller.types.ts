import { Controller } from "./controller";
import { PrivateController } from "./private-controller";

export type Action = () => void;

export type AfterAll<T> = {
    disable: Map<keyof T, Action>;
    validate: Action[];
    validateAll: Map<keyof T, Action>;
    visible: Map<keyof T, Action>;
};

export interface ControllerOptions {
    scrollToError?: boolean;
    trimValues?: boolean;
    validationTimeout?: number;
}

export interface ControllerProps<T extends FormFields<T>> {
    disableIf?: {
        [K in keyof T]?: (fields: Partial<T>) => boolean;
    };
    hideIf?: {
        [K in keyof T]?: (fields: Partial<T>) => boolean;
    };
    initialValidation?: boolean;
    initialValues?: InitialValues<T>;
    options?: ControllerOptions;
    onSubmit?: OnSubmit<T>;
    requiredInvalidMessage?: string | JSX.Element;
    requiredValidMessage?: string | JSX.Element;
    setController: React.Dispatch<React.SetStateAction<PrivateController<T> | undefined>>;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validation?: {
        [K in keyof T]?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
    };
}

export type DefaultActiveRadioId<T> = { [K in keyof T]?: string };

export type DefaultDisabledRadioId<T> = { [K in keyof T]?: string[] };

export type DisableIf<T> = {
    [K in keyof T]?: (fields: Partial<T>) => boolean;
};

export interface ExecutePromise<T> {
    blurAction?: boolean;
    key: T;
    onSuccess?: (result: ValidationPromiseResult) => void;
    promise: ValidationPromise;
    queueId: number;
    withWait: boolean;
}

export interface FieldAdditionalProperties {
    initialValidation?: boolean;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
}

export interface Field extends FieldAdditionalProperties {
    activeId?: string;
    isDisabled: boolean;
    isTouched?: boolean;
    isValid: boolean;
    isValidated: boolean;
    isVisible: boolean;
    options?: Map<
        string,
        {
            isDisabled: boolean;
            isVisible: boolean;
        }
    >;
    validationContent: ValidationContentResult;
    validationInProgress: boolean;
    validationToBeExecuted: boolean;
    value: Value;
}

export type Fields<T> = {
    [K in keyof T]?: Field;
};

export type FieldTypes =
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";

export type FormFields<T> = { [K in keyof T]: Value };

export type HideIf<T> = { [K in keyof T]?: (fields: Partial<T>) => boolean };

export type InitialValues<T> = {
    [K in keyof T]?: T[K] | number;
};

export interface KeyType<T> {
    key: keyof T;
    type?: FieldTypes;
}

export type MapFields<T> = {
    [K in keyof T]: Boolean | Number | String | undefined;
};

export interface OnDisable<T> {
    action: OnDisableAction;
    key: keyof T;
}

export type OnDisableAction = (disable: boolean) => void;

export type OnChangeAction = (isValid: boolean) => void;

export type OnSubmit<T extends FormFields<T>> = (fields: Partial<T>, controller: Controller<T>) => void;

export interface OnValidation<T> {
    action: OnValidationAction;
    key: keyof T;
}

export type OnValidationAction = (
    show: boolean,
    fieldIsValid: boolean,
    validationResult: ValidationContentResult
) => void;

export interface PromiseQueue<T> {
    blurAction?: boolean;
    key: T;
    onSuccess?: (result: ValidationPromiseResult) => void;
    promise: ValidationPromise;
    wait?: number;
}

export interface PrivateProps<T extends FormFields<T>> {
    privateController: PrivateController<T>;
}

export interface SetDefaultIsDisabled<T> {
    id?: string;
    isValidated: boolean;
    key: keyof T;
    type?: FieldTypes;
    validationResult: ValidationResult;
}

export interface SetDefaultIsInvalid<T> {
    initialValidation?: boolean;
    isValidated: boolean;
    key: keyof T;
    type?: FieldTypes;
    validationResult: ValidationResult;
}

export interface SetDefaultIsNotVisible<T> {
    id?: string;
    isValidated: boolean;
    key: keyof T;
    type?: FieldTypes;
    validationResult: ValidationResult;
    value?: string | React.ReactNode;
}

export interface SetFieldValue<T> {
    id?: string;
    isTouched?: boolean;
    isValid?: boolean;
    key: keyof T;
    silent?: boolean;
    value: Value;
}

export interface SetIsDisabled<T> {
    id?: string;
    isDisabled: boolean;
    key: keyof T;
    type?: FieldTypes;
}

export interface SetIsVisible<T> {
    id?: string;
    isVisible: boolean;
    key: keyof T;
    type?: string;
}

export interface SubscribeValidator<T> {
    action: ValidatorResultAction;
    id?: string;
    key: keyof T;
    type?: string;
    validation: ValidatorAction;
}

export type Validation<T> = {
    [K in keyof T]?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
};

export type ValidationContentResult = boolean | string | null | undefined | JSX.Element;

export type ValidationDependencies<T> = { [K in keyof T]?: Set<keyof T> };

export type ValidationPromise = () => Promise<ValidationPromiseResult | undefined | null>;

export type ValidationQueue<T> = { [K in keyof T]?: number };

export interface ValidationPromiseResult {
    isValid: boolean;
    content?: string | JSX.Element;
}

export type ValidationResult =
    | ValidationContentResult
    | {
          isValid: boolean;
          content?: string | JSX.Element;
      }
    | {
          content?: string | JSX.Element;
          promise: ValidationPromise;
          wait?: number;
      };

export interface Validator {
    action?: ValidatorResultAction;
    actions?: Set<ValidatorResultAction>;
    validation: ValidatorAction;
}

export type ValidatorAction = () => ValidationResult;

export type ValidatorResultAction = (validationResult: ValidationResult, submitAction: boolean) => void;

export type Value = boolean | number | string | undefined;
