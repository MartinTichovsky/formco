import { Controller } from "../controller";
import { FormFields, OnSubmit } from "../controller.types";

type RestProps<T> = Omit<
  T,
  | "component"
  | "controller"
  | "disabled"
  | "disabledByDefault"
  | "disableIfNotValid"
  | "onClick"
  | "onSubmit"
  | "type"
>;

export interface SubmitComponentType<
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
> {
  ({
    children,
    controller,
    component,
    disabledByDefault,
    disableIfNotValid,
    onSubmit,
    ...rest
  }: React.PropsWithChildren<
    SubmitProps<T> &
      (
        | ({
            component: undefined;
          } & RestProps<React.ButtonHTMLAttributes<HTMLButtonElement>>)
        | ({
            component?: BComponent;
          } & RestProps<React.ComponentProps<BComponent>>)
      )
  >): JSX.Element;
}

export interface SubmitPrivateProps<T extends FormFields<T>> {
  disabled: boolean;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<Controller<T>>;
}

export type SubmitProps<T extends FormFields<T>> = {
  controller: Controller<T>;
  disabledByDefault?: boolean;
  disableIfNotValid?: boolean;
  onSubmit?: OnSubmit<T>;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSubmit">;
