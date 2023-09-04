import * as React from "react";
import { Controller } from "../../controller";
import { DisableIf, FormFields, HideIf, Validation, ValidationResult } from "../../private-controller.types";

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

export interface FormFieldComponentInitialProps {
    initialState: InitialState;
}

export interface FormFieldComponentState extends InitialState {
    isOnFirstPosition: boolean;
    isSelected: boolean;
}

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
    label?: string | JSX.Element;
    messageComponent?: MComponent;
    name: FormFieldPublicProps<T, K>["$name"];
    onBlur?: (event: React.ChangeEvent) => void;
    onChange?: (event: React.ChangeEvent) => void;
    onFormChange?: (name: K) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
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
    validateOnBlur: FormFieldPublicProps<T, K>["$validateOnBlur"];
    validation?: Validation<T, K>;
    value?: string;
} & CommonFormFieldComponentProps;

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
    $disableIf?: DisableIf<T>;
    $hideIf?: HideIf<T>;
    $id?: string;
    $initialValidation?: boolean;
    $name: K;
    $onBlur?: (event: React.ChangeEvent) => void;
    $onChange?: (event: React.ChangeEvent) => void;
    $onKeyDown?: (event: React.KeyboardEvent) => void;
    $validateOnBlur?: boolean;
    $validateOnChange?: boolean;
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
                    $validation?: Validation<T, K>;
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
                    $validation?: Validation<T, K>;
                    $validationDependencies?: (keyof T)[];
                    $value?: undefined;
                }
        : ElementType extends HTMLTextAreaElement
        ? {
              $hideMessage?: boolean;
              $label?: string | JSX.Element;
              $type?: undefined;
              $validation?: Validation<T, K>;
              $validationDependencies?: (keyof T)[];
              $value?: undefined;
          }
        : {
              $hideMessage?: boolean;
              $label?: string | JSX.Element;
              $type?: undefined;
              $validation?: Validation<T, K>;
              $validationDependencies?: (keyof T)[];
              $value?: undefined;
          });