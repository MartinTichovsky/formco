import { Controller } from "../../controller";
import { PrivateController } from "../../private-controller";
import { DisableIf, FormFields, HideIf, Value } from "../../private-controller.types";

export type FormType = {
    [key: string]: Value;
};

export interface RegisterAfterAll {
    id?: string;
    isDisabled: boolean;
    isVisible: boolean;
    name: string;
    privateController: PrivateController<FormFields<FormType>>;
    selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;
    value: string | React.ReactNode;
}

export type SelectOptionProps<T extends FormFields<T>> = React.PropsWithChildren<
    React.OptionHTMLAttributes<HTMLOptionElement> & {
        $controller: Controller<T>;
        $disableIf?: DisableIf<T>;
        $hideIf?: HideIf<T>;
    }
>;

export interface SelectOptionState {
    isDisabled: boolean;
    isVisible: boolean;
}
