import { Controller } from "../controller";
import { FormFields, Value } from "../controller.types";

export type FormType = {
  [key: string]: Value;
};

export interface RegisterAfterAll {
  controller: Controller<FormFields<FormType>>;
  id?: string;
  isDisabled: boolean;
  isVisible: boolean;
  name: string;
  selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
  value: string | React.ReactNode;
}

export type SelectOptionProps<T extends FormFields<T>> =
  React.PropsWithChildren<
    React.OptionHTMLAttributes<HTMLOptionElement> & {
      controller: Controller<T>;
      disableIf?: (fields: Partial<T>) => boolean;
      hideIf?: (fields: Partial<T>) => boolean;
    }
  >;

export interface SelectOptionState {
  isDisabled: boolean;
  isVisible: boolean;
}
