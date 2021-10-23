import React from "react";
import { Controller } from "../controller";
import { FormFields, ValidationResult } from "../private-controller.types";

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

export interface FormFieldPrivateProps {
  defaultValue: string;
  disabled: boolean;
  onBlur: (event: React.ChangeEvent) => void;
  onChange: (event: React.ChangeEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
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
    React.ComponentProps<IComponent> & FormFieldPrivateProps
  >,
  MComponent extends React.ElementType,
  ElementType,
  HTMLAttributesType
> {
  (
    props: React.PropsWithChildren<
      (
        | ({
            component?: undefined;
            messageComponent: undefined;
          } & HTMLAttributesType)
        | ({
            component?: undefined;
            messageComponent: MComponent;
          } & HTMLAttributesType)
        | ({
            component?: IComponent;
            messageComponent?: MComponent;
          } & Omit<
            React.ComponentPropsWithoutRef<IComponent>,
            "defaultValue" | "disabled" | "onBlur" | "onChange" | "onKeyDown"
          >)
      ) &
        FormFieldPublicProps<T, K> & {
          className?: string;
          onFormChange?: (name: K) => void;
        } & CommonFormFieldProps &
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
                    fields: Partial<T>
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
                    fields: Partial<T>
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
                fields: Partial<T>
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
                fields: Partial<T>
              ) => ValidationResult;
              validationDependencies?: (keyof T)[];
              value?: undefined;
            })
    >
  ): JSX.Element | null;
}
