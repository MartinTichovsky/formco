import React from "react";
import { Controller } from "../controller";
import { FormFields, ValidationResult } from "../controller.types";

export interface CommonFormFieldProps {
  hideMessage?: boolean;
  hideRequiredStar?: boolean;
  required?: boolean;
  requiredComponent?: JSX.Element;
  requiredInvalidMessage?: string | JSX.Element;
  requiredValidMessage?: string | JSX.Element;
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

export interface FormFieldPrivateInputProps<T>
  extends FormFieldPrivateProps<T> {
  onKeyDown: (event: React.KeyboardEvent<T>) => void;
}

export interface FormFieldPrivateProps<T> {
  defaultValue: string;
  disabled: boolean;
  onBlur: (event: React.ChangeEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T>) => void;
}

export interface FormFieldPublicProps<
  T extends FormFields<T>,
  K extends keyof T
> {
  controller: Controller<T>;
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  id?: string;
  initialValidation?: boolean;
  name: K;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export interface FormFieldState extends InitialState {
  isOnFirstPosition: boolean;
  isSelected: boolean;
}

export interface FormFieldType<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> &
      (ElementType extends HTMLInputElement
        ? FormFieldPrivateInputProps<ElementType>
        : FormFieldPrivateProps<ElementType>)
  >,
  MComponent extends React.ElementType,
  ElementType,
  HTMLAttributesType
> {
  ({
    children,
    component,
    controller,
    disableIf,
    hideMessage,
    hideIf,
    hideRequiredStar,
    initialValidation,
    label,
    messageComponent,
    name,
    onFormChange,
    requiredComponent,
    requiredInvalidMessage,
    requiredValidMessage,
    validation,
    validateOnBlur,
    validateOnChange,
    validationDependencies,
    value,
    ...rest
  }: React.PropsWithChildren<
    FormFieldPublicProps<T, K> & {
      className?: string;
      onFormChange?: (name: K, props: typeof rest) => void;
    } & CommonFormFieldProps &
      (
        | ({
            component: undefined;
            messageComponent: undefined;
          } & RestProps<HTMLAttributesType>)
        | ({
            component: undefined;
            messageComponent: MComponent;
          } & RestProps<HTMLAttributesType>)
        | ({
            component?: IComponent;
            messageComponent?: MComponent;
          } & RestProps<React.ComponentPropsWithoutRef<IComponent>>)
      ) &
      (ElementType extends HTMLInputElement
        ?
            | {
                hideMessage?: boolean;
                label?: string | JSX.Element;
                placeholder?: string;
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
                  | "week";
                validation?: (
                  value: T[K] | undefined,
                  fields: Partial<T>,
                  props: typeof rest
                ) => ValidationResult;
                validationDependencies?: (keyof T)[];
                value?: undefined;
              }
            | {
                hideMessage?: undefined;
                label: string | JSX.Element;
                placeholder?: undefined;
                type: "radio";
                validation?: undefined;
                validationDependencies?: undefined;
                value: string;
              }
            | {
                hideMessage?: boolean;
                label: string | JSX.Element;
                placeholder?: undefined;
                type: "checkbox";
                validation?: (
                  value: T[K] | undefined,
                  fields: Partial<T>,
                  props: typeof rest
                ) => ValidationResult;
                validationDependencies?: (keyof T)[];
                value?: undefined;
              }
        : ElementType extends HTMLTextAreaElement
        ? {
            hideMessage?: boolean;
            label?: string | JSX.Element;
            placeholder?: string;
            type?: undefined;
            validation?: (
              value: T[K] | undefined,
              fields: Partial<T>,
              props: typeof rest
            ) => ValidationResult;
            validationDependencies?: (keyof T)[];
            value?: undefined;
          }
        : {
            hideMessage?: boolean;
            label?: string | JSX.Element;
            placeholder?: undefined;
            type?: undefined;
            validation?: (
              value: T[K] | undefined,
              fields: Partial<T>,
              props: typeof rest
            ) => ValidationResult;
            validationDependencies?: (keyof T)[];
            value?: undefined;
          })
  >): JSX.Element | null;
}

type RestProps<T> = Omit<
  T,
  | "children"
  | "component"
  | "controller"
  | "disableIf"
  | "hideMessage"
  | "hideIf"
  | "hideRequiredStar"
  | "initialValidation"
  | "label"
  | "messageComponent"
  | "name"
  | "onFormChange"
  | "requiredComponent"
  | "requiredInvalidMessage"
  | "requiredValidMessage"
  | "validation"
  | "validateOnBlur"
  | "validateOnChange"
  | "validationDependencies"
  | "value"
  // private props
  | "defaultValue"
  | "disabled"
  | "onBlur"
  | "onChange"
  | "onKeyDown"
>;
