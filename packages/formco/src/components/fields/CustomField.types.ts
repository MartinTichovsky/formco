import { Controller } from "../../controller";
import {
    DisableIf,
    FormFields,
    HideIf,
    OnValidationCustom,
    Validation,
    ValidationResult
} from "../../private-controller.types";
import { InitialState } from "./FormField.types";

export interface CustomFieldComponentInitialProps {
    initialState: InitialState;
}

export interface CustomFieldComponentState extends InitialState {}

export interface CustomFieldComponentProps<T extends FormFields<T>, K extends keyof T> {
    controller: CustomFieldPublicProps<T, K>["$controller"];
    disableIf?: CustomFieldPublicProps<T, K>["$disableIf"];
    hideIf?: CustomFieldPublicProps<T, K>["$hideIf"];
    id?: CustomFieldPublicProps<T, K>["$id"];
    initialValidation?: CustomFieldPublicProps<T, K>["$initialValidation"];
    name: CustomFieldPublicProps<T, K>["$name"];
    onBlur?: CustomFieldPublicProps<T, K>["$onBlur"];
    onChange?: CustomFieldPublicProps<T, K>["$onChange"];
    onKeyDown?: CustomFieldPublicProps<T, K>["$onKeyDown"];
    required?: CustomFieldPublicProps<T, K>["$required"];
    rest: Object;
    useDefaultOnValidation: CustomFieldPublicProps<T, K>["$useDefaultOnValidation"];
    validateOnBlur?: CustomFieldPublicProps<T, K>["$validateOnBlur"];
    validateOnChange?: CustomFieldPublicProps<T, K>["$validateOnChange"];
}

export type CustomFieldComponentType<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & CustomFieldPrivateProps>
> = CustomFieldComponentProps<T, K> & {
    component: IComponent;
    onValidation?: OnValidationCustom;
    provideValue?: boolean;
    validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
};

export interface CustomFieldPrivateProps {
    disabled: boolean;
    name: string;
    onBlur: (event: React.ChangeEvent) => void;
    onChange: (event: React.ChangeEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

export interface CustomFieldPublicProps<T extends FormFields<T>, K extends keyof T> {
    $controller: Controller<T>;
    $disableIf?: DisableIf<T>;
    $hideIf?: HideIf<T>;
    $id?: string;
    $initialValidation?: boolean;
    $name: K;
    $onBlur?: (event: React.ChangeEvent) => void;
    $onChange?: (event: React.ChangeEvent) => void;
    $onKeyDown?: (event: React.KeyboardEvent) => void;
    $required?: boolean;
    /**
     * true = set property `error` = true/false on the provided $component on validation fail/success
     */
    $useDefaultOnValidation?: boolean;
    $validateOnBlur?: boolean;
    $validateOnChange?: boolean;
}

export interface CustomFieldType<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & CustomFieldPrivateProps>
> {
    ({
        $component,
        $controller,
        $disableIf,
        $hideIf,
        $id,
        $initialValidation,
        $name,
        $onValidation,
        $provideValue,
        $validation,
        $validateOnBlur,
        $validateOnChange,
        children,
        ...rest
    }: React.PropsWithChildren<
        CustomFieldPublicProps<T, K> & {
            $component: IComponent;
            $onValidation?: OnValidationCustom<typeof rest>;
            $provideValue?: boolean;
            $validation?: Validation<T, K>;
        } & Omit<React.ComponentPropsWithoutRef<IComponent>, "disabled" | "name" | "onBlur" | "onChange" | "onKeyDown">
    >): JSX.Element | null;
}
