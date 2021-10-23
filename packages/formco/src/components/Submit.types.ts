import { Controller } from "../controller";
import { FormFields, OnSubmit } from "../private-controller.types";

export interface SubmitComponentType<
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
> {
  (
    props: React.PropsWithChildren<
      (
        | ({
            component?: undefined;
          } & React.ButtonHTMLAttributes<HTMLButtonElement>)
        | ({
            component?: BComponent;
          } & Omit<
            React.ComponentPropsWithoutRef<BComponent>,
            "disabled" | "onClick"
          >)
      ) &
        SubmitProps<T>
    >
  ): JSX.Element;
}

export interface SubmitPrivateProps<T extends FormFields<T>> {
  disabled: boolean;
  onClick?: (event: React.MouseEvent) => Controller<T>;
}

export type SubmitProps<T extends FormFields<T>> = {
  controller: Controller<T>;
  disabledByDefault?: boolean;
  disableIfNotValid?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onSubmit?: OnSubmit<T>;
};
