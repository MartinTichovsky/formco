import { Controller } from "../controller";
import { FormFields, ValidationResult } from "../private-controller.types";

export interface FieldPrivateProps {
  onBlur: (event: React.ChangeEvent) => void;
  onChange: (event: React.ChangeEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export interface FieldPublicProps<T extends FormFields<T>, K extends keyof T> {
  controller: Controller<T>;
  disableIf?: (fields: Partial<T>) => boolean;
  hideIf?: (fields: Partial<T>) => boolean;
  id?: string;
  initialValidation?: boolean;
  name: K;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export interface FieldType<
  T extends FormFields<T>,
  K extends keyof T,
  IComponent extends React.ComponentType<
    React.ComponentProps<IComponent> & FieldPrivateProps
  >
> {
  ({
    children,
    component,
    controller,
    id,
    name,
    onValidation,
    provideValue,
    validation,
    ...rest
  }: React.PropsWithChildren<
    FieldPublicProps<T, K> & {
      component: IComponent;
      onValidation?: (
        isFieldValid: boolean,
        setProps: React.Dispatch<React.SetStateAction<typeof rest>>,
        validationInProgress: boolean
      ) => void;
      provideValue?: boolean;
      validation?: (
        value: T[K] | undefined,
        fields: Partial<T>
      ) => ValidationResult;
    }
  > &
    React.ComponentPropsWithoutRef<IComponent>): JSX.Element | null;
}
