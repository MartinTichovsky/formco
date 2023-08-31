import { Controller } from "../../controller";
import { FormFields, OnSubmit } from "../../private-controller.types";

export type SubmitComponentType<
    T extends FormFields<T>,
    BComponent extends React.ComponentType<React.ComponentProps<BComponent> & SubmitPrivateProps<T>>
> = {
    component?: BComponent;
} & SubmitComponentProps<T>;

export type SubmitComponentProps<T extends FormFields<T>> = {
    disabledByDefault?: SubmitPublicProps<T>["$disabledByDefault"];
    disableIfNotValid?: SubmitPublicProps<T>["$disableIfNotValid"];
    onClick?: SubmitPublicProps<T>["$onClick"];
    onSubmit?: SubmitPublicProps<T>["$onSubmit"];
    rest?: Object;
};

export interface SubmitPrivateProps<T extends FormFields<T>> {
    disabled: boolean;
    onClick: (event: React.MouseEvent) => Promise<Controller<T>>;
}

export type SubmitPublicProps<T extends FormFields<T>> = {
    $controller: Controller<T>;
    $disabledByDefault?: boolean;
    $disableIfNotValid?: boolean;
    $onClick?: (event: React.MouseEvent) => void;
    $onSubmit?: OnSubmit<T>;
};

export type SubmitType<
    T extends FormFields<T>,
    BComponent extends React.ComponentType<React.ComponentProps<BComponent> & SubmitPrivateProps<T>>
> = (
    | ({
          $component?: undefined;
      } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({
          $component?: BComponent;
      } & Omit<React.ComponentPropsWithoutRef<BComponent>, "disabled" | "onClick">)
) &
    SubmitPublicProps<T>;
