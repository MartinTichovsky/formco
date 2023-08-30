import * as React from "react";
import { Controller } from "../controller";
import { FormFields, ValidationResult } from "../private-controller.types";

export interface CommonFormFieldProps {
    $hideMessage?: boolean;
    $hideRequiredStar?: boolean;
    $required?: boolean;
    $requiredComponent?: JSX.Element;
    $requiredInvalidMessage?: string | JSX.Element;
    $requiredValidMessage?: string | JSX.Element;
}

export interface CommonFormFieldComponentProps {
    hideMessage?: CommonFormFieldProps["$hideMessage"];
    hideRequiredStar?: CommonFormFieldProps["$hideRequiredStar"];
    required?: CommonFormFieldProps["$required"];
    requiredComponent?: CommonFormFieldProps["$requiredComponent"];
    requiredInvalidMessage?: CommonFormFieldProps["$requiredInvalidMessage"];
    requiredValidMessage?: CommonFormFieldProps["$requiredValidMessage"];
}

export interface InitialState {
    isDisabled: boolean;
    isValid?: boolean;
    isVisible: boolean;
    message: ValidationResult;
}

export interface FormFieldInitialProps {
    initialState: InitialState;
}

export interface FormFieldInternalProps {
    fieldType: "input" | "select" | "textarea";
}

export interface FormFieldPrivateProps {
    defaultValue: string;
    disabled: boolean;
    onBlur: (event: React.ChangeEvent) => void;
    onChange: (event: React.ChangeEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

export interface FormFieldPublicProps<T extends FormFields<T>, K extends keyof T> {
    $controller: Controller<T>;
    $disableIf?: (fields: Partial<T>) => boolean;
    $hideIf?: (fields: Partial<T>) => boolean;
    $id?: string;
    $initialValidation?: boolean;
    $name: K;
    $validateOnBlur?: boolean;
    $validateOnChange?: boolean;
}

export interface FormFieldState extends InitialState {
    isOnFirstPosition: boolean;
    isSelected: boolean;
}

export type FormFieldType<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & FormFieldPrivateProps>,
    MComponent extends React.ElementType,
    ElementType = HTMLInputElement,
    HTMLAttributesType = {}
> = (
    | ({
          $component?: undefined;
          $messageComponent: undefined;
      } & HTMLAttributesType)
    | ({
          $component?: undefined;
          $messageComponent: MComponent;
      } & HTMLAttributesType)
    | ({
          $component?: IComponent;
          $messageComponent?: MComponent;
      } & Omit<
          React.ComponentPropsWithoutRef<IComponent>,
          "defaultValue" | "disabled" | "onBlur" | "onChange" | "onKeyDown"
      >)
) &
    FormFieldPublicProps<T, K> & {
        $onFormChange?: (name: K) => void;
    } & CommonFormFieldProps &
    (ElementType extends HTMLInputElement
        ?
              | {
                    $hideMessage?: boolean;
                    $label?: string | JSX.Element;
                    $type?:
                        | undefined
                        | "color"
                        | "date"
                        | "datetime-local"
                        | "email"
                        | "file"
                        | "image"
                        | "month"
                        | "number"
                        | "password"
                        | "range"
                        | "search"
                        | "tel"
                        | "text"
                        | "time"
                        | "url"
                        | "week";
                    $validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
                    $validationDependencies?: (keyof T)[];
                    $value?: undefined;
                }
              | {
                    $hideMessage?: undefined;
                    $label: string | JSX.Element;
                    $type: "radio";
                    $validation?: undefined;
                    $validationDependencies?: undefined;
                    $value: string;
                }
              | {
                    $hideMessage?: boolean;
                    $label: string | JSX.Element;
                    $type: "checkbox";
                    $validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
                    $validationDependencies?: (keyof T)[];
                    $value?: undefined;
                }
        : ElementType extends HTMLTextAreaElement
        ? {
              $hideMessage?: boolean;
              $label?: string | JSX.Element;
              $type?: undefined;
              $validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
              $validationDependencies?: (keyof T)[];
              $value?: undefined;
          }
        : {
              $hideMessage?: boolean;
              $label?: string | JSX.Element;
              $type?: undefined;
              $validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
              $validationDependencies?: (keyof T)[];
              $value?: undefined;
          });

export type FormFieldComponentType<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & FormFieldPrivateProps>,
    MComponent extends React.ElementType
> = {
    component?: IComponent;
    controller: FormFieldPublicProps<T, K>["$controller"];
    disableIf?: FormFieldPublicProps<T, K>["$disableIf"];
    hideIf?: FormFieldPublicProps<T, K>["$hideIf"];
    hideMessage?: boolean;
    id?: FormFieldPublicProps<T, K>["$id"];
    initialValidation?: FormFieldPublicProps<T, K>["$initialValidation"];
    label?: string | JSX.Element;
    messageComponent?: MComponent;
    name: FormFieldPublicProps<T, K>["$name"];
    onFormChange?: (name: K) => void;
    rest: { className?: string } & Object;
    type?:
        | undefined
        | "color"
        | "date"
        | "datetime-local"
        | "email"
        | "file"
        | "image"
        | "month"
        | "number"
        | "password"
        | "range"
        | "search"
        | "tel"
        | "text"
        | "time"
        | "url"
        | "week"
        | "radio"
        | "checkbox";
    validateOnBlur?: FormFieldPublicProps<T, K>["$validateOnBlur"];
    validateOnChange?: FormFieldPublicProps<T, K>["$validateOnChange"];
    validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
    validationDependencies?: (keyof T)[];
    value?: string;
} & CommonFormFieldComponentProps;
