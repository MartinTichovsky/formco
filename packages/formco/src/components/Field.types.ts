import { Controller } from "../controller";
import { FormFields, ValidationResult } from "../private-controller.types";

export interface FieldPrivateProps {
  onBlur: (event: React.ChangeEvent) => void;
  onChange: (event: React.ChangeEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
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
  }: React.PropsWithChildren<{
    component: IComponent;
    controller: Controller<T>;
    id?: string;
    name: K;
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
  }> &
    React.ComponentPropsWithoutRef<IComponent>): JSX.Element | null;
}
