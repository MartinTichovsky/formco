import { FormControllerProps } from "./components/FormController.types";
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
    /**
     * If true, it set an initial value when a field goes disabled
     */
    setInitialValueOnDisable?: boolean;
    scrollToError?: boolean;
    trimValues?: boolean;
    validationTimeout?: number;
}

export interface ControllerProps<T extends FormFields<T>> {
    disableIf?: {
        [K in keyof T]?: DisableIf<T>;
    };
    hideIf?: {
        [K in keyof T]?: HideIf<T>;
    };
    initialValues?: InitialValues<T>;
    options?: ControllerOptions;
    onSubmit?: OnSubmit<T>;
    onValidation?: FormControllerProps<T>["onValidation"];
    requiredInvalidMessage?: string | JSX.Element;
    requiredValidMessage?: string | JSX.Element;
    /**
     * A helper dispatch function to re-set the PrivateController
     */
    setFormControllerState: React.Dispatch<React.SetStateAction<PrivateControllerSetKey>>;
    /**
     * Do not increase the keyIndex which re-render the whole form
     */
    silent?: boolean;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validation?: {
        [K in keyof T]?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
    };
}

export type DefaultActiveRadioId<T> = { [K in keyof T]?: string };

export type DefaultDisabledRadioId<T> = { [K in keyof T]?: string[] };

export type DisableIf<T> = (fields: FieldsPublic<T>) => boolean | { isDisabled: boolean; value: Value };

export type DisableIfObject<T> = {
    [K in keyof T]?: DisableIf<T>;
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

export interface FieldPublic<T, K extends keyof T> {
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
    validationInProgress: boolean;
    validationToBeExecuted: boolean;
    value?: T[K];
}

export type FieldsPublic<T> = {
    [K in keyof T]?: FieldPublic<T, K>;
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

export type HideIf<T> = (fields: FieldsPublic<T>) => boolean;

export type HideIfObject<T> = { [K in keyof T]?: HideIf<T> };

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

export type OnValidationCustom<E = unknown> = <R = unknown>(
    isFieldValid: boolean,
    setProps: React.Dispatch<React.SetStateAction<E | R>>,
    validationInProgress: boolean
) => void;

export interface PrivateControllerSetKey {
    key: number;
    silent: boolean;
}

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
    value?: Value;
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

export type Validation<T, K extends keyof FormFields<T>> = (
    value: T[K] | undefined,
    fields: Partial<T>
) => ValidationResult;

export type ValidationObject<T> = {
    [K in keyof T]?: Validation<T, K>;
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
